"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Prevents full-page hard reloads
    });

    if (result?.error) {
      setError("Invalid credential matrix keys.");
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="border border-neutral-800 rounded p-6 bg-neutral-900/10 max-w-sm w-full space-y-4">
        <div>
          <h1 className="text-lg font-mono font-bold">system_auth</h1>
          <p className="text-xs text-neutral-500 mt-1">Provide credential matrix keys</p>
        </div>

        {error && (
          <div className="text-xs font-mono text-red-500 border border-red-900/50 bg-red-950/20 px-3 py-2 rounded">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-xs font-mono text-neutral-400">Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-1.5 text-sm outline-none focus:border-neutral-700" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-mono text-neutral-400">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-1.5 text-sm outline-none focus:border-neutral-700" 
            />
          </div>
          <button type="submit" className="w-full bg-neutral-100 text-neutral-950 font-mono text-xs font-bold py-2 rounded hover:bg-neutral-200 transition">
            Initialize Access
          </button>
        </form>
      </div>
    </div>
  );
}