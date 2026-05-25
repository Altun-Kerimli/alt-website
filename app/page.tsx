"use client";

import { useEffect, useRef, useState } from "react";
import PortfolioSection from "./components/PortfolioSection";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";

// --- Lightweight Scroll Reveal Component ---
function Reveal({ children, delay = "" }: { children: React.ReactNode, delay?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Only animate once
        }
      },
      { threshold: 0.15 } // Triggers when 15% of the section is visible
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
  // Use state to trigger the Hero animation exactly when the page loads
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Hero Section */}
      <section className="relative w-full bg-white dark:bg-black px-6 md:px-12 flex flex-col items-center justify-center text-center min-h-[calc(100vh-73px)] transition-colors duration-300">
        
        {/* Razor-thin Red Top Line */}
        <div className={`absolute top-0 left-0 w-full h-[2px] bg-red-600 transition-all duration-1000 ${mounted ? "opacity-100" : "opacity-0"}`}></div>
        
        <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
          
          {/* Stagger 1: Title slides up first (Restored md:text-7xl) */}
          <h1 className={`text-5xl md:text-7xl font-extrabold tracking-tighter text-black dark:text-white mb-6 transition-all duration-1000 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            Hello there.<br/>
            Welcome to <span className="text-red-600">ALT</span> INC. 
          </h1>
          
          {/* Stagger 2: Paragraph follows slightly after (delay-300) */}
          <p className={`text-neutral-600 dark:text-neutral-400 leading-relaxed text-xl max-w-2xl font-medium mx-auto mt-4 transition-all duration-1000 delay-300 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            I build web applications, Telegram bots, and automated digital tools. Clean code, reliable infrastructure, and straightforward execution.
          </p>

          {/* Stagger 3: Scroll indicator drops in last (delay-700) */}
          <div className={`absolute bottom-12 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-700 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="animate-bounce">
              <div className="w-px h-16 bg-gradient-to-b from-transparent to-red-600"></div>
            </div>
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