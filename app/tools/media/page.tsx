"use client";

export default function MediaEngineDisabledPage() {
  return (
    <div className="w-full max-w-2xl bg-white dark:bg-black mx-auto px-4 mt-12 space-y-4">
      <header className="border-b border-black/10 dark:border-white/10 pb-4 transition-colors">
        <h1 className="text-xl font-mono font-bold tracking-tight text-neutral-600 dark:text-neutral-300">/tools/media <span className="text-red-600">[OFFLINE]</span></h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">This module has been temporarily suspended.</p>
      </header>
      <div className="p-6 border border-black/10 dark:border-white/10 border-dashed rounded-xl bg-neutral-50 dark:bg-neutral-900/50 text-center transition-colors">
        <span className="text-xs font-mono font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">Awaiting infrastructure upgrades. Check back later.</span>
      </div>
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";

// interface ScannedMetadata {
//   title: string;
//   uploader: string;
//   duration: number;
//   available_heights: string[];
// }

// export default function MediaEnginePage() {
//   const [url, setUrl] = useState("");
//   const [file, setFile] = useState<File | null>(null);
//   const [mode, setMode] = useState<"video" | "audio">("video");
//   const [videoFormat, setVideoFormat] = useState("1080");
//   const [audioFormat, setAudioFormat] = useState("mp3");
  
//   // Application workflow states
//   const [loading, setLoading] = useState(false);
//   const [hasScanned, setHasScanned] = useState(false);
//   const [metadata, setMetadata] = useState<ScannedMetadata | null>(null);
//   const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
//   const [error, setError] = useState("");
//   const [mounted, setMounted] = useState(false);

//   // Dynamic base URL for local development vs. production (Vercel/Render)
//   const baseUrl = process.env.NEXT_PUBLIC_MEDIA_ENGINE_URL || "http://localhost:8000";

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const handleScanTarget = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!url && !file) return;
//     setLoading(true);
//     setError("");
    
//     if (file) {
//       // Local source bypass configuration state
//       setMetadata({
//         title: file.name,
//         uploader: "Local Upload Matrix",
//         duration: 0,
//         available_heights: ["240", "360", "720", "1080"]
//       });
//       setLoading(false);
//       setHasScanned(true);
//       return;
//     }

//     try {
//       const res = await fetch(`${baseUrl}/api/scan?url=${encodeURIComponent(url)}`);
//       if (!res.ok) throw new Error("Could not parse destination stream index.");
//       const data = await res.json();
      
//       setMetadata(data);
      
//       // Auto-adjust default choice to closest match if absolute 1080p is missing
//       if (data.available_heights.length > 0 && !data.available_heights.includes("1080")) {
//         setVideoFormat(data.available_heights[data.available_heights.length - 1]);
//       }
      
//       setHasScanned(true);
//     } catch (err: any) {
//       setError(err.message || "Failed to analyze link structure parameters.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReset = () => {
//     setUrl("");
//     setFile(null);
//     setMetadata(null);
//     setHasScanned(false);
//     setError("");
//   };

//   const handleExecuteProtocol = async () => {
//     setLoading(true);
//     const taskId = crypto.randomUUID();
//     setCurrentTaskId(taskId);

//     const selectedFormat = mode === "video" ? videoFormat : audioFormat;

//     if (file) {
//       // POST logic for physical local files
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("format_selection", selectedFormat);
//       formData.append("task_id", taskId);

//       try {
//         const response = await fetch(`${baseUrl}/api/upload`, {
//           method: "POST",
//           body: formData,
//         });

//         if (!response.ok) throw new Error("Local file processing failed.");

//         // Convert the returned byte stream into a client-side download anchor
//         const blob = await response.blob();
//         const blobUrl = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = blobUrl;
//         a.download = `${file.name.split('.')[0]}_audio.${selectedFormat}`;
//         document.body.appendChild(a);
//         a.click();
//         a.remove();
//         window.URL.revokeObjectURL(blobUrl);
//       } catch (err) {
//         setError("Error communicating with file processing endpoint.");
//       } finally {
//         setTimeout(() => {
//           setLoading(false);
//           setCurrentTaskId(null);
//         }, 1500);
//       }
//     } else {
//       // GET logic for remote URLs (Existing architecture)
//       const downloadUrl = `${baseUrl}/api/download?url=${encodeURIComponent(url)}&mode=${mode}&format_selection=${selectedFormat}&task_id=${taskId}`;
      
//       const a = document.createElement('a');
//       a.href = downloadUrl;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);

//       setTimeout(() => {
//         setLoading(false);
//         setCurrentTaskId(null);
//       }, 15000);
//     }
//   };

//   const handleCancel = async () => {
//     if (!currentTaskId) return;
//     try {
//       await fetch(`${baseUrl}/api/cancel`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ task_id: currentTaskId }),
//       });
//     } catch (err) {
//       console.error("Termination instruction dropped.");
//     } finally {
//       setLoading(false);
//       setCurrentTaskId(null);
//     }
//   };

//   if (!mounted) return null;

//   return (
//     <div className="w-full max-w-2xl mx-auto px-4 mt-6 space-y-2">
//       <header className="border-b border-neutral-800 pb-4">
//         <h1 className="text-xl font-mono font-bold tracking-tight">/tools/media</h1>
//         <p className="text-xs text-neutral-500 mt-1">Multi-threaded video merging and audio extraction matrix.</p>
//       </header>

//       <div className="space-y-6">
//         {/* Mode Selector - Equally Proportioned Grid Column Rows */}
//         <div className="grid grid-cols-2 border-b border-neutral-800 font-mono text-xs w-full">
//           <button 
//             onClick={() => { setMode("video"); handleReset(); }}
//             disabled={loading}
//             className={`text-center py-3 border-b-2 transition uppercase tracking-wider ${mode === "video" ? "border-neutral-200 text-neutral-100 font-bold" : "border-transparent text-neutral-500 hover:text-neutral-300"}`}
//           >
//             [ Video Download ]
//           </button>
//           <button 
//             onClick={() => { setMode("audio"); handleReset(); }}
//             disabled={loading}
//             className={`text-center py-3 border-b-2 transition uppercase tracking-wider ${mode === "audio" ? "border-neutral-200 text-neutral-100 font-bold" : "border-transparent text-neutral-500 hover:text-neutral-300"}`}
//           >
//             [ Audio Separate ]
//           </button>
//         </div>

//         {error && (
//           <div className="text-xs font-mono text-red-500 border border-red-900/50 bg-red-950/20 px-3 py-2 rounded">
//             {error}
//           </div>
//         )}

//         {/* Step 1: Ingestion Vector Selection View */}
//         {!hasScanned && (
//           <form onSubmit={handleScanTarget} className="space-y-4 animate-in fade-in duration-200">
//             <div className="grid grid-cols-1 gap-4">
//               <div className="space-y-2">
//                 <label className="text-xs font-mono text-neutral-400">Stream Resource Target Link</label>
//                 <input
//                   type="url"
//                   placeholder="Paste streaming destination resource link..."
//                   value={url}
//                   onChange={(e) => setUrl(e.target.value)}
//                   disabled={!!file || loading}
//                   className="w-full bg-neutral-900/50 border border-neutral-800 rounded px-3 py-2 text-sm outline-none focus:border-neutral-600 font-mono text-neutral-200 transition disabled:opacity-30"
//                 />
//               </div>

//               {mode === "audio" && (
//                 <div className="space-y-2">
//                   <div className="text-center text-xs font-mono text-neutral-600 my-1">— OR —</div>
//                   <label className="text-xs font-mono text-neutral-400">Local Source Video File Profile</label>
//                   <input
//                     type="file"
//                     accept="video/mp4,video/mkv,video/webm,video/*"
//                     disabled={!!url || loading}
//                     onChange={(e) => setFile(e.target.files?.[0] || null)}
//                     className="w-full bg-neutral-900/30 border border-neutral-800 border-dashed rounded px-3 py-4 text-xs font-mono text-neutral-400 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-mono file:bg-neutral-800 file:text-neutral-200 hover:file:bg-neutral-700 file:cursor-pointer transition disabled:opacity-30"
//                   />
//                 </div>
//               )}
//             </div>

//             <button
//               type="submit"
//               disabled={(!url && !file) || loading}
//               className="w-full flex items-center justify-center p-3 border border-neutral-800 rounded font-mono text-xs text-neutral-300 hover:border-neutral-600 hover:bg-neutral-900/40 transition disabled:opacity-20"
//             >
//               {loading ? "Parsing Stream Layout Attributes..." : "Verify Target Resource [Enter]"}
//             </button>
//           </form>
//         )}

//         {/* Step 2: Quality Arrays Customization (Rendered purely after successful index scan) */}
//         {hasScanned && metadata && (
//           <div className="space-y-6 animate-in slide-in-from-bottom-3 duration-300">
//             <div className="flex justify-between items-center bg-neutral-900/30 border border-neutral-800 rounded px-4 py-3">
//               <div className="font-mono text-xs truncate max-w-[75%]">
//                 <span className="text-neutral-500 font-bold">READY:</span>{" "}
//                 <span className="text-neutral-300 font-medium">{metadata.title}</span>
//                 <span className="text-neutral-500 block text-[10px] mt-0.5">{metadata.uploader} {metadata.duration > 0 && `• ${metadata.duration}s`}</span>
//               </div>
//               <button 
//                 onClick={handleReset}
//                 disabled={loading}
//                 className="text-[10px] font-mono text-neutral-400 hover:text-neutral-200 underline whitespace-nowrap ml-4"
//               >
//                 Reset Target
//               </button>
//             </div>

//             <div className="p-4 border border-neutral-800 rounded bg-neutral-900/10 space-y-3">
//               <div className="text-xs font-mono text-neutral-400">Processing Container Parameters:</div>
              
//               {mode === "video" ? (
//                 <div className="flex flex-wrap gap-6 font-mono text-xs">
//                   {["240", "360", "720", "1080"].map((res) => {
//                     const isAvailable = metadata.available_heights.length === 0 || metadata.available_heights.some(h => parseInt(h) >= parseInt(res));
//                     return (
//                       <label 
//                         key={res} 
//                         className={`flex items-center gap-2 cursor-pointer transition ${isAvailable ? "text-neutral-300 hover:text-white" : "text-neutral-600 cursor-not-allowed line-through"}`}
//                       >
//                         <input 
//                           type="radio" 
//                           name="videoRes" 
//                           value={res} 
//                           disabled={loading || !isAvailable}
//                           checked={videoFormat === res}
//                           onChange={(e) => setVideoFormat(e.target.value)}
//                           className="accent-neutral-200"
//                         />
//                         {res}p ({!isAvailable ? "N/A" : "Muxed .mp4"})
//                       </label>
//                     );
//                   })}
//                 </div>
//               ) : (
//                 <div className="flex flex-wrap gap-6 font-mono text-xs">
//                   {[
//                     { id: "mp3", label: "MP3 Standard (192kbps Audio Layer)" },
//                     { id: "wav", label: "WAV Linear PCM (Lossless Waveform)" }
//                   ].map((fmt) => (
//                     <label key={fmt.id} className="flex items-center gap-2 cursor-pointer text-neutral-300 hover:text-white">
//                       <input 
//                         type="radio" 
//                         name="audioFmt" 
//                         value={fmt.id} 
//                         disabled={loading}
//                         checked={audioFormat === fmt.id}
//                         onChange={(e) => setAudioFormat(e.target.value)}
//                         className="accent-neutral-200"
//                       />
//                       {fmt.label}
//                     </label>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Execution Controls Group */}
//             <div className="space-y-4">
//               {!loading ? (
//                 <button
//                   onClick={handleExecuteProtocol}
//                   className="w-full flex items-center justify-center p-4 border border-neutral-800 rounded font-mono text-sm font-bold bg-neutral-100 text-neutral-900 hover:bg-neutral-300 transition"
//                 >
//                   Execute Sharded Download Stream
//                 </button>
//               ) : (
//                 <div className="space-y-3 animate-in fade-in duration-300">
//                   <div className="w-full bg-neutral-950 border border-neutral-800 rounded h-2 overflow-hidden relative">
//                     <div className="bg-neutral-400 h-full w-2/3 animate-pulse rounded-r progress-bar-fill"></div>
//                   </div>
//                   <div className="flex justify-between items-center text-xs font-mono">
//                     <span className="text-neutral-400 animate-pulse">
//                       Downloading segments across 16 channels... Multiplexing track nodes...
//                     </span>
//                     <button
//                       onClick={handleCancel}
//                       className="text-red-500 border border-red-900/40 bg-red-950/10 px-3 py-1 rounded hover:bg-red-950/40 hover:border-red-500 transition font-bold"
//                     >
//                       Abrupt Kill Process [X]
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }