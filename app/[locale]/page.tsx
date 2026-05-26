"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from 'next-intl';
import Image from "next/image";
import PortfolioSection from "../components/PortfolioSection";
import AboutSection from "../components/AboutSection";
import ContactSection from "../components/ContactSection";

// --- Lightweight Scroll Reveal Component ---
function Reveal({ children, delay = "" }: { children: React.ReactNode, delay?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); 
        }
      },
      { threshold: 0.15 } 
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${delay} ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const h = useTranslations('Hero'); 
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Hero Section */}
      <section className="relative w-full bg-white dark:bg-black px-6 md:px-12 flex flex-col items-center justify-start pt-32 pb-24 md:pt-40 md:pb-32 text-center md:text-left min-h-[55vh] md:min-h-[calc(100vh-73px)] transition-colors duration-300">
        
        {/* Razor-thin Red Top Line */}
        <div className={`absolute top-0 left-0 w-full h-[2px] bg-red-600 transition-all duration-1000 ${mounted ? "opacity-100" : "opacity-0"}`}></div>
        
        {/* Constrained max-width to bring columns closer together */}
        <div className="max-w-5xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16 relative z-10">
          
          {/* Left Column: Text */}
          <div className="flex flex-col items-center md:items-start flex-1 w-full">
            
            {/* Stagger 1: Title */}
            <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tighter text-black dark:text-white mb-4 transition-all duration-1000 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              {h('greeting')}<br/>
              {h('welcome')} <span className="text-red-600">ALT</span> INC. 
            </h1>

            {/* Mobile Logo: Appears between Title and Description only on small screens */}
            <div className={`md:hidden relative w-40 h-40 my-4 transition-all duration-1000 delay-200 ease-out ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
               <div className="absolute inset-0 bg-red-600/10 dark:bg-red-600/5 blur-3xl rounded-full"></div>
               <Image 
                 src="/logo.png" 
                 alt="A UN Logo" 
                 fill
                 className="object-contain drop-shadow-[0_0_15px_rgba(220,38,38,0.2)]"
               />
            </div>
            
            {/* Stagger 2: Paragraph */}
            <p className={`text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg max-w-lg font-medium mt-2 transition-all duration-1000 delay-300 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              {h('description')}
            </p>
          </div>

          {/* Right Column: Desktop Logo */}
          <div className={`hidden md:flex flex-col items-center justify-center flex-1 w-full transition-all duration-1000 delay-500 ease-out ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}>
            <div className="relative w-72 h-72 lg:w-80 lg:h-80 group">
              {/* Interactive red ambient glow */}
              <div className="absolute inset-0 bg-red-600/5 dark:bg-red-600/10 blur-3xl rounded-full transition-all duration-700 group-hover:bg-red-600/20 dark:group-hover:bg-red-600/20 group-hover:scale-110"></div>
               <Image 
                 src="/logo.png" 
                 alt="A UN Logo" 
                 fill
                 className="object-contain relative z-10 transition-transform duration-700 group-hover:scale-105 drop-shadow-[0_0_25px_rgba(220,38,38,0.2)]"
                 priority
               />
            </div>
          </div>

        </div>

        {/* Stagger 3: Scroll indicator */}
        <div className={`absolute bottom-12 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-700 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="animate-bounce">
            <div className="w-px h-16 bg-gradient-to-b from-transparent to-red-600"></div>
          </div>
        </div>

      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="w-full bg-neutral-50 dark:bg-neutral-950 border-y border-black/5 dark:border-white/5 py-16 md:py-16 px-6 md:px-12 scroll-mt-24 transition-colors duration-300">
        <Reveal>
          <PortfolioSection />
        </Reveal>
      </section>

      {/* About Section */}
      <section id="about" className="w-full bg-white dark:bg-black py-16 md:py-16 px-6 md:px-12 scroll-mt-24 transition-colors duration-300">
        <Reveal>
          <AboutSection />
        </Reveal>
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-full bg-neutral-50 dark:bg-neutral-950 border-t border-black/5 dark:border-white/5 py-16 md:py-16 px-6 md:px-12 scroll-mt-24 transition-colors duration-300">
        <Reveal>
          <ContactSection />
        </Reveal>
      </section>
      
    </div>
  );
}