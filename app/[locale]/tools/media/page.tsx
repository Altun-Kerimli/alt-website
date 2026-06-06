"use client";

import { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';

export default function MediaEngineDisabledPage() {
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('Maintenance');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-black mx-auto px-4 mt-12 space-y-4 reveal-base">
      
      <header className="section-header">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-mono font-bold tracking-tight text-neutral-600 dark:text-neutral-300">
            /tools/media {t('title')} <span className="text-red-600">[{t('status_offline')}]</span>
          </h1>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{t('status')}</p>
      </header>

      <div className="p-6 border border-black/10 dark:border-white/10 border-dashed rounded-xl bg-neutral-50 dark:bg-neutral-900/50 text-center transition-colors">
        <span className="text-xs font-mono font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">{t('description')}</span>
      </div>
    </div>
  );
}