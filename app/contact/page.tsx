"use client";

import { useState, useEffect } from "react";

export default function ContactPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const contacts = [
    {
      id: "telegram",
      platform: "Telegram Matrix",
      address: "@Alt_K_141", // Replace with your Telegram handle
      href: "https://t.me/Alt_K_141",
      accent: "border-[#229ED9]/50 shadow-[0_12px_24px_-10px_rgba(34,158,217,0.4)] hover:shadow-[0_12px_30px_-8px_rgba(34,158,217,0.6)] hover:border-[#229ED9]/80 hover:bg-[#229ED9]/5",
      textColor: "text-[#229ED9]",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m22 2-7 20-4-9-9-4Z"/>
          <path d="M22 2 11 13"/>
        </svg>
      )
    },
    {
      id: "instagram",
      platform: "Instagram Grid",
      address: "@alt_karim_li_business", // Replace with your Instagram handle
      href: "https://instagram.com/alt_karim_li_business/",
      accent: "border-[#E1306C]/50 shadow-[0_12px_24px_-10px_rgba(225,48,108,0.4)] hover:shadow-[0_12px_30px_-8px_rgba(225,48,108,0.6)] hover:border-[#E1306C]/80 hover:bg-[#E1306C]/5",
      textColor: "text-[#E1306C]",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
        </svg>
      )
    },
    {
      id: "email",
      platform: "Secure Email",
      address: "karimli.altun@gmail.com", // Replace with your actual email
      href: "mailto:karimli.altun@gmail.com",
      accent: "border-emerald-500/50 shadow-[0_12px_24px_-10px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_30px_-8px_rgba(16,185,129,0.6)] hover:border-emerald-400/80 hover:bg-emerald-950/10",
      textColor: "text-emerald-400",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="16" x="2" y="4" rx="2"/>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
        </svg>
      )
    }
  ];

  if (!mounted) return null;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 mt-5 space-y-10 mb-16">
      
      {/* Header Section */}
      <header className="border-b border-neutral-800 pb-4">
        <h1 className="text-xl font-mono font-bold tracking-tight text-neutral-200">
          <span className="text-amber-500 mr-2">[ALT]</span>
          Altun / communications
        </h1>
        <p className="text-xs text-neutral-500 mt-2">
          Direct connection protocols. Select a channel to initiate transfer.
        </p>
      </header>

      {/* Communications Matrix */}
      <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 gap-4">
          
          {/* List Header (Hidden on small screens) */}
          <div className="hidden sm:grid grid-cols-2 px-4 pb-2 text-[10px] uppercase tracking-wider font-mono text-neutral-600 border-b border-neutral-800/50">
            <div>Vector / Protocol</div>
            <div className="text-right">Destination / Redirect</div>
          </div>

          {/* Contact Cards */}
          {contacts.map((contact) => (
            <a
              key={contact.id}
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex flex-col sm:grid sm:grid-cols-2 gap-4 items-start sm:items-center p-4 border bg-neutral-900/40 rounded transition-all duration-300 cursor-pointer ${contact.accent}`}
            >
              {/* Left Column: Icon & Platform */}
              <div className="flex items-center gap-4 w-full">
                <div className={`p-2 border border-current bg-neutral-950 rounded transition-colors duration-300 ${contact.textColor}`}>
                  {contact.icon}
                </div>
                <div className={`font-mono text-sm font-bold transition-colors duration-300 ${contact.textColor}`}>
                  {contact.platform}
                </div>
              </div>

              {/* Right Column: Redirect Link */}
              <div className="w-full sm:text-right font-mono text-xs text-neutral-400 flex justify-between sm:justify-end items-center sm:gap-4 transition-colors duration-300 group-hover:text-neutral-200">
                <span className="truncate max-w-[200px] sm:max-w-[250px]">
                  {contact.address}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`opacity-50 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 ${contact.textColor}`}>
                  <path d="M7 7h10v10"/>
                  <path d="M7 17 17 7"/>
                </svg>
              </div>
            </a>
          ))}
          
        </div>
      </section>

      {/* PGP / Extra Info Block */}
      <div className="p-4 border border-dashed border-neutral-800 rounded bg-neutral-900/10 text-center animate-in fade-in duration-700 delay-200">
        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
          
        </span>
      </div>
      
    </div>
  );
}