"use client";

import { useState, useEffect } from "react";

import { useTranslations } from 'next-intl';

export default function ContactSection() {
  const [mounted, setMounted] = useState(false);
  const c = useTranslations('Contact'); // Connects to the "Contact" object in your JSON

  useEffect(() => {
    setMounted(true);
  }, []);

  const contacts = [
    {
      id: "telegram",
      platform: c('telegram'),
      address: "@Alt_K_141",
      href: "https://t.me/Alt_K_141",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m22 2-7 20-4-9-9-4Z"/>
          <path d="M22 2 11 13"/>
        </svg>
      )
    },
    {
      id: "instagram",
      platform: c('instagram'),
      address: "@alt_karim_li_business",
      href: "https://instagram.com/alt_karim_li_business/",
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
      platform: c('email'),
      address: "karimli.altun@gmail.com",
      href: "mailto:karimli.altun@gmail.com",
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
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Header Section */}
      <header className="border-b border-black/10 dark:border-white/10 pb-5 flex flex-col gap-2 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 bg-red-600 rounded-sm"></div> 
          <h2 className="text-3xl font-extrabold tracking-tight text-black dark:text-white transition-colors duration-300">{c('title')}</h2>
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium ml-6 transition-colors duration-300">{c('description')}</p>
      </header>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contacts.map((contact) => (
          <a
            key={contact.id}
            href={contact.href}
            target="_blank"
            rel="noopener noreferrer"
            // Base Colors -> Hover Red Glow Effect
            className="group flex flex-col justify-between p-6 h-40 border-2 border-black/5 dark:border-white/5 bg-white dark:bg-black rounded-2xl transition-all duration-500 hover:border-red-600/50 dark:hover:border-red-600/50 hover:shadow-[0_10px_40px_-10px_rgba(220,38,38,0.2)] dark:hover:shadow-[0_10px_40px_-10px_rgba(220,38,38,0.3)] hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              {/* Icon Container: Flips from subtle gray to solid red */}
              <div className="p-2.5 bg-neutral-100 dark:bg-neutral-900 border border-black/5 dark:border-white/10 rounded-xl text-black dark:text-white transition-colors duration-300 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 dark:group-hover:bg-red-600 dark:group-hover:border-red-600">
                {contact.icon}
              </div>
              <div className="font-bold text-black dark:text-white text-lg transition-colors duration-300">
                {contact.platform}
              </div>
            </div>

            <div className="w-full flex justify-between items-center mt-6">
              <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400 truncate max-w-[200px] transition-colors duration-300 group-hover:text-black dark:group-hover:text-white">
                {contact.address}
              </span>
              {/* Slide-in Action Arrow */}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                <path d="M5 12h14"/>
                <path d="m12 5 7 7-7 7"/>
              </svg>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}