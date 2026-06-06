"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function ToolsSection() {
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('Tools'); 

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 pb-6">
      
      <header className="section-header">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 bg-red-600 rounded-sm"></div> 
          <h2 className="section-title">{t('title')}</h2>
        </div>
        <p className="section-desc">{t('description2')}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Decoder Tool */}
        <Link href="/tools/decoder" className="group card-interactive p-8 block reveal-base">
          <div className="flex flex-col h-full justify-center">
            <div className="font-bold text-xl text-black dark:text-white transition-colors">
              {t('decoder')}
            </div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 font-medium transition-colors group-hover:text-black dark:group-hover:text-white">
              {t('decoder_description')}
            </div>
            
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-red-600 group-hover:text-red-700 transition-colors">
              {t('visit_tool')}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </div>
          </div>
        </Link>

        {/* Media Engine Tool (Placeholder) */}
        <div className="card-interactive p-8 opacity-60 block reveal-base" style={{ transitionDelay: "100ms" }}>
          <div className="flex flex-col h-full justify-center relative">
            <div className="absolute top-0 right-0 flex items-center gap-2">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-[10px] font-mono text-neutral-400">{t('offline')}</span>
            </div>
            <div className="font-bold text-xl text-black dark:text-white transition-colors">
              {t('media_engine')}
            </div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 font-medium transition-colors">
              {t('media_engine_description')}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}