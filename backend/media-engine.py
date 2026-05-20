import os
import uuid
import psutil
import subprocess
from fastapi import FastAPI, HTTPException, BackgroundTasks, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import yt_dlp

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

DOWNLOAD_DIR = "downloads"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

active_processes = {}

def cleanup_file(filepath: str):
    try:
        if os.path.exists(filepath):
            os.remove(filepath)
    except Exception:
        pass

@app.get("/api/scan")
async def scan_media(url: str):
    if not url:
        raise HTTPException(status_code=400, detail="URL target missing.")
    
    ydl_opts = {'quiet': True}
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            formats = info.get('formats', [])
            heights = set()
            for f in formats:
                if f.get('vcodec') != 'none' and f.get('height'):
                    heights.add(str(f.get('height')))
            
            return {
                "title": info.get('title', 'Unknown Stream Resource'),
                "duration": info.get('duration', 0),
                "uploader": info.get('uploader', 'Unknown Source'),
                "available_heights": sorted(list(heights), key=lambda x: int(x))
            }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/download")
async def download_media(url: str, mode: str, format_selection: str, task_id: str, background_tasks: BackgroundTasks):
    if not url:
        raise HTTPException(status_code=400, detail="Resource token missing.")

    outtmpl = f"{DOWNLOAD_DIR}/{task_id}.%(ext)s"
    common_opts = {
        'outtmpl': outtmpl,
        'quiet': True,
        'concurrent_fragment_downloads': 16,
    }

    if mode == "audio":
        ydl_opts = {
            **common_opts,
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': format_selection,
                'preferredquality': '192' if format_selection == 'mp3' else None
            }]
        }
        expected_ext = format_selection
    else:
        target = format_selection
        ydl_opts = {
            **common_opts,
            'format': f'bestvideo[height<={target}][vcodec^=avc]+bestaudio[acodec^=mp4a]/bestvideo[height<={target}][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<={target}]+bestaudio/best',
            'merge_output_format': 'mp4',
            'postprocessors': [{
                'key': 'FFmpegVideoConvertor',
                'preferedformat': 'mp4',
            }],
        }
        expected_ext = "mp4"

    try:
        active_processes[task_id] = os.getpid()

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            title = info.get('title', 'extraction')
            safe_title = "".join([c for c in title if c.isalpha() or c.isdigit() or c in ' .-_']).strip()

        actual_filepath = f"{DOWNLOAD_DIR}/{task_id}.{expected_ext}"

        if not os.path.exists(actual_filepath):
            raise HTTPException(status_code=500, detail="Muxing track aggregation failure.")

        background_tasks.add_task(cleanup_file, actual_filepath)
        active_processes.pop(task_id, None)

        return FileResponse(
            path=actual_filepath,
            filename=f"{safe_title}.{expected_ext}",
            media_type='application/octet-stream' 
        )

    except Exception as e:
        active_processes.pop(task_id, None)
        raise HTTPException(status_code=400, detail=str(e))

# --- NEW FILE UPLOAD ENDPOINT ---
@app.post("/api/upload")
async def process_local_file(
    file: UploadFile = File(...),
    format_selection: str = Form(...),
    task_id: str = Form(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    input_ext = file.filename.split('.')[-1] if '.' in file.filename else 'mp4'
    input_path = f"{DOWNLOAD_DIR}/input_{task_id}.{input_ext}"
    output_path = f"{DOWNLOAD_DIR}/{task_id}.{format_selection}"

    # Save incoming physical file to disk
    with open(input_path, "wb") as buffer:
        buffer.write(await file.read())

    def cleanup_both():
        cleanup_file(input_path)
        cleanup_file(output_path)
    
    background_tasks.add_task(cleanup_both)

    try:
        # Construct raw FFmpeg separation command
        cmd = ["ffmpeg", "-y", "-i", input_path, "-vn"]
        if format_selection == "mp3":
            cmd.extend(["-c:a", "libmp3lame", "-b:a", "192k"])
        else:
            cmd.extend(["-c:a", "pcm_s16le"])
        cmd.append(output_path)
        
        subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        safe_title = "".join([c for c in file.filename.split('.')[0] if c.isalpha() or c.isdigit() or c in ' .-_']).strip()

        return FileResponse(
            path=output_path,
            filename=f"{safe_title}_audio.{format_selection}",
            media_type='application/octet-stream'
        )
    except subprocess.CalledProcessError:
        raise HTTPException(status_code=500, detail="FFmpeg failed to demux audio from local file.")

@app.post("/api/cancel")
async def cancel_task(payload: dict):
    task_id = payload.get("task_id")
    if not task_id or task_id not in active_processes:
        return {"status": "inactive"}
    
    try:
        pid = active_processes.get(task_id)
        if pid:
            parent = psutil.Process(pid)
            for child in parent.children(recursive=True):
                child.kill()
            parent.kill()
        active_processes.pop(task_id, None)
        return {"status": "terminated"}
    except:
        active_processes.pop(task_id, None)
        return {"status": "error"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)