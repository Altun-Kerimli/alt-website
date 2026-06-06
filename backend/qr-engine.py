import io
import base64
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import qrcode
from pyzbar.pyzbar import decode
from PIL import Image
from pydantic import BaseModel

app = FastAPI(title="ALT_SYS QR Engine")

# Allow Next.js frontend to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, change to your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    payload: str

@app.post("/api/qr/generate")
async def generate_qr(request: GenerateRequest):
    if not request.payload:
        raise HTTPException(status_code=400, detail="Payload cannot be empty")
    
    try:
        # Generate QR Code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )
        qr.add_data(request.payload)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")
        
        # Convert to Base64 for easy frontend rendering
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        
        return {"status": "success", "image": f"data:image/png;base64,{img_str}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/qr/decode")
async def decode_qr(file: UploadFile = File(...)):
    try:
        # Read image file into Pillow
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Decode using pyzbar
        decoded_objects = decode(image)
        
        if not decoded_objects:
            return {"status": "error", "message": "No QR code detected in image"}
            
        # Extract the data from the first QR code found
        qr_data = decoded_objects[0].data.decode('utf-8')
        
        return {"status": "success", "data": qr_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to process image. Ensure it is a valid image file.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)