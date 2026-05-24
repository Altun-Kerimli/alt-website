import PortfolioSection from "./components/PortfolioSection";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";

export default function HomePage() {
  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Hero Section */}
      <section className="relative w-full bg-white dark:bg-black px-6 md:px-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-700 min-h-[calc(100vh-73px)] transition-colors duration-300">
        
        {/* Razor-thin Red Top Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-red-600"></div>
        
        <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-black dark:text-white mb-6 transition-colors duration-300">
            Hello there.<br/>
            Welcome to <span className="text-red-600">ALT</span> INC. 
          </h1>
          
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-xl max-w-2xl font-medium mx-auto mt-4 transition-colors duration-300">
            I build web applications, Telegram bots, and automated digital tools. Clean code, reliable infrastructure, and straightforward execution.
          </p>

          {/* Bouncing Red Gradient Line (Scroll Indicator) */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-px h-16 bg-gradient-to-b from-transparent to-red-600"></div>
          </div>

        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="w-full bg-neutral-50 dark:bg-neutral-950 border-y border-black/5 dark:border-white/5 py-16 md:py-16 px-6 md:px-12 scroll-mt-24 transition-colors duration-300">
        <PortfolioSection />
      </section>

      {/* About Section */}
      <section id="about" className="w-full bg-white dark:bg-black py-16 md:py-16 px-6 md:px-12 scroll-mt-24 transition-colors duration-300">
        <AboutSection />
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-full bg-neutral-50 dark:bg-neutral-950 border-t border-black/5 dark:border-white/5 py-16 md:py-16 px-6 md:px-12 scroll-mt-24 transition-colors duration-300">
        <ContactSection />
      </section>
      
    </div>
  );
}