"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from 'next-intl';

type ToolTab = "generate" | "read";

// Upgraded Copy Component: Handles both Text and Base64 PNG Images
const CopyButton = ({ text, labelCopy, labelCopied }: { text: string, labelCopy: string, labelCopied: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    try {
      // If the text is a Base64 image URL, convert and copy as an actual image file
      if (text.startsWith("data:image/")) {
        const res = await fetch(text);
        const blob = await res.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob })
        ]);
      } else {
        // Otherwise, copy as standard text
        await navigator.clipboard.writeText(text);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard operation failed:", err);
    }
  };

  return (
    <button 
      type="button"
      onClick={handleCopy}
      disabled={!text}
      className={`text-[10px] font-bold px-3 py-1 rounded transition-colors duration-200 uppercase tracking-wider ${
        copied 
          ? "bg-red-600 text-white border-transparent" 
          : "bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 text-neutral-500 hover:text-black dark:hover:text-white hover:border-black/30 dark:hover:border-white/30"
      } disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {copied ? labelCopied : labelCopy}
    </button>
  );
};

export default function QRCodePage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<ToolTab>("generate");
  const [loading, setLoading] = useState(false);
  const q = useTranslations('Qr');

  // Generate State
  const [generateInput, setGenerateInput] = useState("");
  const [qrImageResult, setQrImageResult] = useState<string | null>(null);

  // Decode State
  const [decodeResult, setDecodeResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  // --- CORE UPLOAD LOGIC ---
  const processImageFile = async (file: File) => {
    setLoading(true);
    setError(null);
    setDecodeResult(null);
    setActiveTab("read"); // Auto-switch to read tab if pasted globally

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/api/qr/decode", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (data.status === "success") {
        setDecodeResult(data.data);
      } else {
        setError(data.message || "Failed to decode image.");
      }
    } catch (err) {
      setError("Engine offline. Make sure Python backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  // --- GLOBAL PASTE LISTENER (CTRL+V / CMD+V) ---
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      // Ignore paste if user is typing in the generator text area
      if (document.activeElement?.tagName === "TEXTAREA" && activeTab === "generate") return;

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processImageFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [activeTab]);

  // --- GENERATE LOGIC ---
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!generateInput) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8000/api/qr/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: generateInput }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setQrImageResult(data.image);
      } else {
        setError("Failed to generate QR code.");
      }
    } catch (err) {
      setError("Engine offline. Make sure Python backend is running.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="w-full max-w-4xl bg-white dark:bg-black mx-auto px-6 md:px-12 py-16 space-y-8 reveal-base">
      
      <header className="section-header">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 bg-red-600 rounded-sm"></div> 
          <h1 className="section-title">{q('tools')} <span className="text-neutral-300 dark:text-neutral-700">/</span> {q('title')}</h1>
        </div>
      </header>

      {/* --- TAB NAVIGATION --- */}
      <div className="grid grid-cols-2 border-b border-black/10 dark:border-white/10 font-bold text-sm w-full transition-colors">
        <button
          onClick={() => { setActiveTab("generate"); setError(null); }}
          className={`text-center py-4 border-b-[3px] transition-all uppercase tracking-widest ${
            activeTab === "generate"
              ? "border-red-600 text-neutral-900 dark:text-neutral-100 hover:text-red-600 dark:hover:text-red-600"
              : "border-transparent text-neutral-400 hover:text-black dark:hover:text-white hover:border-black/20 dark:hover:border-white/20"
          }`}
        >
          {q('generate_url')}
        </button>
        <button
          onClick={() => { setActiveTab("read"); setError(null); }}
          className={`text-center py-4 border-b-[3px] transition-all uppercase tracking-widest ${
            activeTab === "read"
              ? "border-red-600 text-neutral-900 dark:text-neutral-100 hover:text-red-600 dark:hover:text-red-600"
              : "border-transparent text-neutral-400 hover:text-black dark:hover:text-white hover:border-black/20 dark:hover:border-white/20"
          }`}
        >
          {q('qr_reader')}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-900/50 text-red-600 dark:text-red-400 text-xs font-mono font-bold rounded-xl animate-in fade-in slide-in-from-top-2">
          [!] {error}
        </div>
      )}

      <div className="min-h-[400px]">
        
        {/* --- TAB 1: GENERATE --- */}
        {activeTab === "generate" && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <form onSubmit={handleGenerate} className="space-y-4 p-6 border border-black/5 dark:border-white/10 rounded-2xl bg-white dark:bg-black shadow-sm flex flex-col transition-colors">
              <label className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-500">{q('input')}</label>
              <textarea
                value={generateInput}
                onChange={(e) => setGenerateInput(e.target.value)}
                placeholder={q('placeholder')}
                className="w-full bg-neutral-50 dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-xl px-4 py-4 text-sm font-mono font-bold text-black dark:text-white outline-none focus:border-red-600 dark:focus:border-red-600 focus:bg-white dark:focus:bg-black transition-all flex-1 min-h-[200px] resize-none"
              />
              <button disabled={loading} type="submit" className="w-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black font-mono text-xs font-bold py-3 rounded-xl hover:bg-red-600 dark:hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50">
                {loading ? q('generating') : q('generate')}
              </button>
            </form>

            <div className="p-6 border border-black/5 dark:border-white/10 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 shadow-sm flex flex-col transition-colors">
              <div className="flex justify-between items-center mb-4">
                <label className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-500">{q('output')}</label>
                <CopyButton text={qrImageResult || ""} labelCopy={q('copy')} labelCopied={q('copied')} />
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center min-h-[250px]">
                {qrImageResult ? (
                  <div className="space-y-4 flex flex-col items-center animate-in zoom-in-95 duration-300">
                    <div className="bg-white p-4 rounded-xl shadow-md border border-black/10">
                      <img src={qrImageResult} alt="Generated QR" className="w-48 h-48 object-contain" />
                    </div>
                    <a href={qrImageResult} download="qr_code.png" className="text-xs font-mono font-bold text-red-600 hover:underline">
                      {q('download_qr')}
                    </a>
                  </div>
                ) : (
                  <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">{q('awaiting_payload')}</span>
                )}
              </div>
            </div>
            
          </section>
        )}

        {/* --- TAB 2: READ --- */}
        {activeTab === "read" && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 gap-6 max-w-2xl mx-auto">
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group border-2 border-dashed border-black/20 dark:border-white/20 hover:border-red-600 dark:hover:border-red-600 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer bg-neutral-50 dark:bg-neutral-900/30 hover:bg-red-50 dark:hover:bg-red-950/10 transition-colors"
            >
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400 group-hover:text-red-600 transition-colors mb-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
              <span className="text-sm font-bold text-black dark:text-white font-mono">{q('upload_text')}</span>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-2">{q('upload_description')}</span>
            </div>

            {loading && <div className="text-center font-mono text-xs text-neutral-500 animate-pulse">{q('processing')}</div>}

            {decodeResult && (
              <div className="space-y-3 p-6 border border-black/5 dark:border-white/10 rounded-2xl bg-white dark:bg-black shadow-sm animate-in fade-in slide-in-from-top-4 transition-colors flex flex-col">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-500">{q('process_complete')}</label>
                  <CopyButton text={decodeResult} labelCopy={q('copy')} labelCopied={q('copied')} />
                </div>
                {/* Removed cursor-not-allowed so user can highlight normally */}
                <textarea
                  readOnly
                  value={decodeResult}
                  className="w-full bg-neutral-100 dark:bg-neutral-900/50 border border-black/5 dark:border-white/5 rounded-xl px-4 py-4 text-sm font-mono font-bold text-black dark:text-white outline-none resize-none transition-colors"
                  rows={4}
                />
              </div>
            )}
            
          </section>
        )}
      </div>
    </div>
  );
} 