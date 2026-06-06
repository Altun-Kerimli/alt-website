"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";

import { useTranslations } from 'next-intl';

export default function PreferencesMenu() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const n = useTranslations('Navbar'); // Connects to the "Navbar" object in your JSON
  
  const pathname = usePathname();
  const router = useRouter();
  
  // Dynamically grab the current locale from the URL (e.g., /tr/about -> TR)
  const currentUrlLocale = (pathname.split('/')[1] || 'en').toUpperCase();
  const [activeLang, setActiveLang] = useState(currentUrlLocale);
  
  // States for Click Interaction
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);

  // Prevent hydration mismatch and handle outside clicks
  useEffect(() => {
    setMounted(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsLangOpen(false); // reset language dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return <div className="w-8 h-8"></div>; // Placeholder to prevent layout shift

  const isDark = resolvedTheme === "dark";

  const languages = [
    { code: "EN", label: "English", flag: "🇬🇧" },
    { code: "TR", label: "Türkçe", flag: "🇹🇷" },
    { code: "AZ", label: "Azərbaycan", flag: "🇦🇿" },
    { code: "UK", label: "Українська", flag: "🇺🇦" },
    { code: "RU", label: "Русский", flag: "🇷🇺" },
    { code: "DE", label: "Deutsch", flag: "🇩🇪" },
  ];

  const currentLang = languages.find(l => l.code === activeLang) || languages[0];

  return (
    <div className="relative py-2 flex items-center" ref={menuRef}>
      
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

      {/* Main Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-[calc(100%+0.5rem)] right-0 w-56 flex flex-col bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 dropdown-reveal">
          
          {/* Theme Toggle Section */}
          <div className="p-2 border-b border-black/5 dark:border-white/5">
            <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest px-3 py-2">{n('appearance')}</div>
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-red-600 dark:hover:text-red-600 text-black dark:text-white transition-colors"
            >
              <span className="text-sm font-medium">{isDark ? n('dark_theme') : n('light_theme')}</span>
              
              {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              )}
            </button>
          </div>

          {/* Language Selection Section */}
          <div className="p-2">
            <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest px-3 py-2">{n('language')}</div>
            
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 text-black dark:text-white transition-colors"
            >
              <div className="flex items-center gap-3 text-sm font-medium">
                <span className="text-base leading-none">{currentLang.flag}</span>
                <span>{currentLang.label}</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${isLangOpen ? "rotate-180 text-red-600" : "text-neutral-400"}`}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {isLangOpen && (
              <div className="mt-1 flex flex-col gap-0.5 bg-neutral-50 dark:bg-neutral-950/50 rounded-lg p-1 dropdown-reveal">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setActiveLang(lang.code);
                      setIsLangOpen(false);
                      setIsOpen(false);
                      
                      // Push to new localized URL
                      const newLocale = lang.code.toLowerCase();
                      const newPath = pathname.replace(/^\/[a-z]{2}/, `/${newLocale}`);
                      router.push(newPath || `/${newLocale}`);
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
                      activeLang === lang.code
                        ? "bg-red-600/10 text-red-600 font-bold"
                        : "hover:bg-neutral-200/50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-sm leading-none">{lang.flag}</span>
                      <span>{lang.label}</span>
                    </div>
                    {activeLang === lang.code && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-red-600"><polyline points="20 6 9 17 4 12"/></svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}