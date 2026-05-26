import Link from "next/link";

import { useTranslations } from 'next-intl';

export default function ToolsPage() {
  const t = useTranslations('Tools'); // Connects to the "Tools" object in your JSON

  return (
    <div className="w-full max-w-5xl bg-white dark:bg-black mx-auto px-6 md:px-12 py-16 md:py-24 space-y-10 animate-in fade-in duration-700">
      
      <header className="border-b border-black/10 dark:border-white/10 pb-5 flex flex-col gap-2 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 bg-red-600 rounded-sm"></div> 
          <h1 className="text-3xl font-extrabold tracking-tight text-black dark:text-white transition-colors">{t('title')}</h1>
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium ml-4 transition-colors">{t('description')}</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link href="/tools/media" className="group p-8 border-2 border-black/5 dark:border-white/5 bg-white dark:bg-black rounded-2xl transition-all duration-500 hover:border-red-600/50 dark:hover:border-red-600/50 hover:shadow-[0_10px_40px_-10px_rgba(220,38,38,0.2)] dark:hover:shadow-[0_10px_40px_-10px_rgba(220,38,38,0.3)] hover:-translate-y-1 block">
          <div className="font-bold text-lg text-black dark:text-white transition-colors">{t('media_engine')}</div>
          <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 font-medium transition-colors group-hover:text-black dark:group-hover:text-white">{t('media_engine_description')}</div>
        </Link>

        <Link href="/tools/decoder" className="group p-8 border-2 border-black/5 dark:border-white/5 bg-white dark:bg-black rounded-2xl transition-all duration-500 hover:border-red-600/50 dark:hover:border-red-600/50 hover:shadow-[0_10px_40px_-10px_rgba(220,38,38,0.2)] dark:hover:shadow-[0_10px_40px_-10px_rgba(220,38,38,0.3)] hover:-translate-y-1 block">
          <div className="font-bold text-lg text-black dark:text-white transition-colors">{t('decoder')}</div>
          <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 font-medium transition-colors group-hover:text-black dark:group-hover:text-white">{t('decoder_description')}</div>
        </Link>
        
        {/* Placeholder for future grid expansions */}
        <div className="p-8 border-2 border-black/5 dark:border-white/5 border-dashed bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl opacity-60 block transition-colors">
          <div className="font-bold text-lg text-neutral-400 dark:text-neutral-500">{t('awaiting_deployment')}</div>
          <div className="text-sm text-neutral-400 dark:text-neutral-500 mt-2 font-medium">{t('slot_available')}</div>
        </div>
      </div>
    </div>
  );
}