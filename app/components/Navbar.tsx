"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import PreferencesMenu from "./PreferencesMenu";

export default function Navbar() {
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Smart Navbar Scroll Logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowNav(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <nav className={`fixed w-full top-0 z-50 border-b border-black/5 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-xl px-6 py-4 md:px-12 transition-transform duration-300 ${showNav ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-bold tracking-tight text-lg text-black dark:text-white hover:text-amber-500 transition-colors">
            <span className="text-amber-500 mr-1">/</span>ALT
          </Link>
          
          {/* DESKTOP MENU (Hidden on Mobile) */}
          <div className="hidden md:flex gap-6 text-sm font-medium text-neutral-500 dark:text-neutral-400 items-center">
            
            {/* Portfolio Dropdown */}
            <div className="group relative py-2">
              <Link href="/#portfolio" className="hover:text-red-600 transition flex items-center gap-1.5">
                Portfolio
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 transition-transform duration-200 group-hover:rotate-180"><path d="m6 9 6 6 6-6"/></svg>
              </Link>
              <div className="absolute top-[100%] left-0 w-full h-2"></div>
              <div className="absolute top-[calc(100%+0.5rem)] left-0 w-48 hidden group-hover:flex flex-col bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden py-1.5">
                <Link href="/#websites" className="px-5 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-red-600 transition-colors">Web Sites</Link>
                <Link href="/#tg-bots" className="px-5 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-red-600 transition-colors">Telegram Bots</Link>
                <Link href="/#mobile" className="px-5 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-red-600 transition-colors">Mobile Apps</Link>
                <Link href="/#ai-automation" className="px-5 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-red-600 transition-colors">Automation</Link>
                <Link href="/#others" className="px-5 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-red-600 transition-colors">Others</Link>
              </div>
            </div>

            <Link href="/#about" className="py-2 hover:text-red-600 transition-colors">About Me</Link>
            <Link href="/#contact" className="py-2 hover:text-red-600 transition-colors">Contact</Link>
            <div className="group relative py-2"> | </div>

            {/* Tools Dropdown */}
            <div className="group relative py-2">
              <Link href="/tools" className="hover:text-red-600 transition flex items-center gap-1.5">
                Tools
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 transition-transform duration-200 group-hover:rotate-180"><path d="m6 9 6 6 6-6"/></svg>
              </Link>
              <div className="absolute top-[100%] left-0 w-full h-2"></div>
              <div className="absolute top-[calc(100%+0.5rem)] left-0 w-44 hidden group-hover:flex flex-col bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden py-1.5">
                <Link href="/tools/decoder" className="px-5 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-red-600 transition-colors">Decoder</Link>
                <Link href="/tools/media" className="px-5 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-400 transition-colors opacity-70 flex justify-between items-center">
                  <span className="line-through">Media</span>
                  <span className="text-[10px] font-mono border border-black/10 dark:border-white/10 px-1.5 py-0.5 rounded">Offline</span>
                </Link>
              </div>
            </div>

            {/* Gear Dropdown (Theme & Language) */}
            <PreferencesMenu />
            
          </div>

          {/* MOBILE HAMBURGER ICON */}
          <button className="md:hidden p-2 text-black dark:text-white focus:outline-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-[60px] left-0 w-full bg-white dark:bg-black border-b border-black/5 dark:border-white/10 shadow-xl z-40 p-6 flex flex-col gap-5 text-base font-bold text-black dark:text-white h-[calc(100vh-60px)] overflow-y-auto">
          
          <Link href="/#portfolio" onClick={() => setMobileMenuOpen(false)}>Portfolio</Link>
          <Link href="/#about" onClick={() => setMobileMenuOpen(false)}>About Me</Link>
          <Link href="/#contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          <Link href="/tools" onClick={() => setMobileMenuOpen(false)}>Tools</Link>
          
          {/* Mobile Preferences Section */}
          <div className="pt-6 mt-2 border-t border-black/10 dark:border-white/10 flex flex-col gap-6">
            
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Appearance</span>
              {mounted && (
                <button onClick={() => { setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'); }} className="flex items-center gap-3 text-sm font-medium">
                  {resolvedTheme === 'dark' ? (
                    <><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg> Switch to Light Mode</>
                  ) : (
                    <><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg> Switch to Dark Mode</>
                  )}
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Language</span>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { code: "EN", label: "English", flag: "🇬🇧" },
                  { code: "TR", label: "Türkçe", flag: "🇹🇷" },
                  { code: "AZ", label: "Azərbaycan", flag: "🇦🇿" },
                  { code: "UK", label: "Українська", flag: "🇺🇦" },
                  { code: "RU", label: "Русский", flag: "🇷🇺" },
                  { code: "DE", label: "Deutsch", flag: "🇩🇪" },
                ].map((lang) => (
                  <button key={lang.code} className="flex items-center gap-2 text-sm font-medium hover:text-red-600 transition-colors text-left">
                    <span className="text-base">{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}