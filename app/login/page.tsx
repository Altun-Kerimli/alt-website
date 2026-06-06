"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  
  // Validation State (from Server)
  const [hash, setHash] = useState("");
  const [expires, setExpires] = useState("");
  const [error, setError] = useState("");
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // --- STEP 1: Request OTP ---
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Matrix request failed.");
      } else {
        setHash(data.hash);
        setExpires(data.expires.toString());
        setStep(2); // Move to 2FA phase
      }
    } catch (err) {
      setError("Network protocol failure.");
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2: Final Login Authorization ---
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      otp,
      hash,
      expires,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      window.location.href = "/admin"; 
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
      <div className="w-full max-w-md border border-white/10 bg-black rounded-2xl p-8 space-y-8 shadow-[0_0_40px_-10px_rgba(220,38,38,0.15)] relative overflow-hidden group">
        
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-600/30 rounded-2xl transition-colors duration-700 pointer-events-none"></div>

        <header className="border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 justify-center items-center relative ml-1">
              <span className="pulse-indicator-ping opacity-70"></span>
              <span className="pulse-indicator-base"></span>
            </span>
            <h1 className="text-xl font-mono font-bold text-white tracking-widest ml-1">system_auth</h1>
          </div>
          <p className="text-xs text-neutral-500 font-mono mt-2 ml-7">
            {step === 1 ? "Provide credential matrix keys" : "Awaiting 2FA confirmation vector"}
          </p>
        </header>

        {error && (
          <div className="text-xs font-mono text-red-400 border border-red-900/50 bg-red-950/20 px-4 py-3 rounded-xl animate-in fade-in slide-in-from-top-2">
            [!] {error}
          </div>
        )}

        {/* STEP 1 FORM */}
        {step === 1 && (
          <form className="space-y-6 animate-in fade-in" onSubmit={handleRequestCode}>
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-500">Email Vector</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all text-white font-mono placeholder:text-neutral-700" 
                placeholder="admin@alt.sys"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-500">Passkey</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all text-white font-mono tracking-widest" 
                placeholder="••••••••"
              />
            </div>
            <button disabled={loading} type="submit" className="w-full bg-white text-black font-mono text-xs font-bold py-3.5 rounded-xl hover:bg-red-600 hover:text-white hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all duration-300 uppercase tracking-widest mt-4 disabled:opacity-50">
              {loading ? "Transmitting..." : "Request 2FA Matrix"}
            </button>
          </form>
        )}

        {/* STEP 2 FORM */}
        {step === 2 && (
          <form className="space-y-6 animate-in slide-in-from-right-4 fade-in" onSubmit={handleVerifyCode}>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-500">Secure OTP Code</label>
                <span className="text-[10px] font-mono text-red-500">Expires in 5m</span>
              </div>
              <input 
                type="text" 
                required 
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-center text-xl tracking-[0.5em] outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all text-white font-mono" 
                placeholder="000000"
              />
            </div>
            <button disabled={loading} type="submit" className="w-full bg-red-600 text-white font-mono text-xs font-bold py-3.5 rounded-xl hover:bg-red-700 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all duration-300 uppercase tracking-widest mt-4 disabled:opacity-50">
              {loading ? "Verifying..." : "Initialize Access"}
            </button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-center text-[10px] font-mono text-neutral-500 hover:text-white transition-colors uppercase tracking-widest pt-2">
              Cancel / Return
            </button>
          </form>
        )}

      </div>
    </div>
  );
}