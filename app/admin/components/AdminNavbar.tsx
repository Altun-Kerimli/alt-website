"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { signOut } from "next-auth/react"; // <-- NextAuth logout import

export default function AdminNavbar() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return <div className="h-16 w-full border-b border-black/10 dark:border-white/10"></div>;

  const isDark = resolvedTheme === "dark";

  return (
    <nav className="w-full border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black px-6 py-4 flex justify-between items-center">
      <Link href="/admin" className="font-mono font-bold text-black dark:text-white hover:text-red-600 transition-colors">
        ALT_SYS <span className="text-red-600">/admin</span>
      </Link>

      <div className="flex items-center gap-6">
        
        {/* Moved Logout Action natively into the navbar */}
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-500 hover:text-red-600 transition-colors"
        >
          <span>LOGOUT</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
        </button>

        <div className="relative" ref={menuRef}>
          {/* Gear Icon Trigger */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`p-1 text-black dark:text-white transition-all duration-300 focus:outline-none ${
              isOpen ? "opacity-100 text-red-600 dark:text-red-600" : "opacity-40 hover:opacity-100 hover:text-red-600"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-500 ${isOpen ? "rotate-90" : ""}`}>
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>

          {/* Theme Only Dropdown */}
          {isOpen && (
            <div className="absolute top-[calc(100%+0.5rem)] right-0 w-48 flex flex-col bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-50 dropdown-reveal">
              <div className="p-2">
                <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest px-3 py-2">Appearance</div>
                <button
                  onClick={() => setTheme(isDark ? 'light' : 'dark')}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-black dark:text-white transition-colors"
                >
                  <span className="text-sm font-medium">{isDark ? "Dark Theme" : "Light Theme"}</span>
                  {isDark ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );

}