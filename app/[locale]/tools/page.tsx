"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function ToolsPage() {
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('Tools');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full max-w-5xl bg-white dark:bg-black mx-auto px-6 md:px-12 py-16 md:py-24 space-y-10">
      
      {/* Header with base reveal */}
      <div className="reveal-base">
        <header className="section-header">
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 bg-red-600 rounded-sm"></div> 
            <h1 className="section-title">{t('title')}</h1>
          </div>
          <p className="section-desc ml-4">{t('description')}</p>
        </header>
      </div>

      {/* Grid with staggered delay reveal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 reveal-base" style={{ transitionDelay: "200ms" }}>

        <Link href="/tools/decoder" className="group card-interactive p-8 block">
          <div className="font-bold text-lg text-black dark:text-white transition-colors">{t('decoder')}</div>
          <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 font-medium transition-colors group-hover:text-black dark:group-hover:text-white">{t('decoder_description')}</div>
        </Link>
        
        <Link href="/tools/media" className="group card-interactive p-8 block">
          <div className="font-bold text-lg text-black dark:text-white transition-colors">{t('media_engine')}</div>
          <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 font-medium transition-colors group-hover:text-black dark:group-hover:text-white">{t('media_engine_description')}</div>
        </Link>
        
        <Link href="/tools/qr" className="group card-interactive p-8 block">
          <div className="font-bold text-lg text-black dark:text-white transition-colors">{t('qr')}</div>
          <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 font-medium transition-colors group-hover:text-black dark:group-hover:text-white">{t('qr_description')}</div>
        </Link>

      </div>
    </div>
  );
}