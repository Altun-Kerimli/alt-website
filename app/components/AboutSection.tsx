"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link"; 

import { useTranslations } from 'next-intl';

export default function AboutSection() {
  const [mounted, setMounted] = useState(false);
  const a = useTranslations('About');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-6">
      
      {/* Header Section */}
      <header className="section-header">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 bg-red-600 rounded-sm"></div> 
          <h2 className="section-title">About Me</h2>
        </div>
        <p className="section-desc">Software engineering, infrastructure, and core principles.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
        
        {/* Left Column: Visuals & Academic Badges */}
        <div className="md:col-span-4 space-y-8 reveal-base">
          
          {/* Profile Image Container */}
          <div className="relative w-full aspect-square border border-black/10 dark:border-white/10 rounded-xl bg-neutral-100 dark:bg-neutral-900 overflow-hidden group shadow-sm transition-all duration-500 hover:shadow-xl dark:hover:border-white/20">
            <Image 
              src="/profile.png" 
              alt="Altun Karimli" 
              fill
              className="object-cover transition-all duration-700 ease-out"
              unoptimized
            />
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-3">
              
              {/* SAU Badge - using Global Pack */}
              <div className="group badge-academic">
                <div className="w-9 h-9 relative shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                  <Image src="/sau-logo.svg" alt="SAU" fill className="object-contain" unoptimized/>
                </div>
                <div className="flex flex-col ps-4">
                  <span className="text-sm font-bold text-black dark:text-white transition-colors duration-300">SAÜ</span>
                  <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium flex items-center gap-1.5 transition-colors duration-300">{a('msc')} | 2025 - {a('present')}</span>
                </div>
              </div>

              {/* SUBU Badge - using Global Pack */}
              <div className="group badge-academic">
                <div className="w-9 h-9 relative shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                  <Image src="/subu-logo.svg" alt="SUBU" fill className="object-contain" unoptimized/>
                </div>
                <div className="flex flex-col ps-4">
                  <span className="text-sm font-bold text-black dark:text-white transition-colors duration-300">SUBÜ</span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium transition-colors duration-300">{a('bsc')} | 2020 - 2025</span>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* Right Column: Narrative */}
        <div className="md:col-span-8 space-y-10 text-[15px] text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium mt-2 reveal-base" style={{ transitionDelay: "100ms" }}>
  
          <section className="border-l-[3px] border-red-600 pl-6 space-y-3 transition-colors duration-300">
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg text-justify transition-colors duration-300">
              {a.rich('text1', {
                sauLink: (chunks) => (
                  <Link 
                    href="https://cs.sakarya.edu.tr/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-accent-link"
                  >
                    {chunks}
                  </Link>
                )
              })}
            </p>
          </section>

          <section className="border-l-[3px] border-red-600 pl-6 space-y-3 transition-colors duration-300">
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg text-justify transition-colors duration-300">
              {a.rich('text2', {
                portfolioLink: (chunks) => (
                  <Link 
                    href="/#portfolio" 
                    className="text-accent-link"
                  >
                    {chunks}
                  </Link>
                )
              })}
            </p>
          </section>

          <section className="border-l-[3px] border-red-600 pl-6 space-y-3 transition-colors duration-300">
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg text-justify transition-colors duration-300">
              {a('text3')} 
            </p>
          </section>
        
        </div>
      </div>
    </div>
  );
}