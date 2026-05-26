"use client"; 

import { useState, useEffect } from "react"; 
import Image from "next/image"; 
import { supabase } from "@/app/lib/supabase"; 
import { useTranslations } from 'next-intl'; 
import Link from "next/link"; // Corrected import for proper routing

interface PortfolioItem { 
  id: string; 
  title: string; 
  link: string; 
  category: string; 
  tags: string[]; 
  images: string[]; 
} 

export default function PortfolioSection() { 
  const [items, setItems] = useState<PortfolioItem[]>([]); 
  const [activeTab, setActiveTab] = useState("websites"); 
  const [loading, setLoading] = useState(true); 

  // --- AGGRESSIVE URL PURIFIER --- 
  useEffect(() => { 
    const cleanAndSyncHash = () => { 
      const fullHash = window.location.hash; 
      if (!fullHash) return; 

      const hashes = fullHash.split("#").filter(Boolean); 
      const targetHash = hashes.reverse().find(h => CATEGORIES.some(c => c.id === h)); 

      if (targetHash) { 
        setActiveTab(targetHash); 
        const cleanUrl = window.location.pathname + window.location.search + "#" + targetHash; 
        if (window.location.hash !== "#" + targetHash) { 
          window.history.replaceState(null, "", cleanUrl); 
        } 
      } 
    }; 

    cleanAndSyncHash(); 
    window.addEventListener("hashchange", cleanAndSyncHash); 

    const handleAnchorClick = (e: MouseEvent) => { 
      const target = e.target as HTMLElement; 
      const anchor = target.closest("a"); 
      
      if (anchor && anchor.href.includes("/#")) { 
        const hashes = anchor.href.split("#").filter(Boolean); 
        const targetHash = hashes.reverse().find(h => CATEGORIES.some(c => c.id === h)); 

        if (targetHash) { 
          setActiveTab(targetHash); 
          setTimeout(() => { 
            const cleanUrl = window.location.pathname + window.location.search + "#" + targetHash; 
            window.history.replaceState(null, "", cleanUrl); 
          }, 10); 
        } 
      } 
    }; 
    
    document.addEventListener("click", handleAnchorClick); 

    return () => { 
      window.removeEventListener("hashchange", cleanAndSyncHash); 
      document.removeEventListener("click", handleAnchorClick); 
    }; 
  }, []); 

  const handleTabSwitch = (id: string) => { 
    setActiveTab(id); 
    const cleanUrl = window.location.pathname + window.location.search + "#" + id; 
    window.history.replaceState(null, "", cleanUrl); 
  }; 

  useEffect(() => { 
    async function fetchPortfolios() { 
      setLoading(true); 
      const { data, error } = await supabase 
        .from("portfolios") 
        .select("*") 
        .order("created_at", { ascending: false }); 
      
      if (!error && data) { 
        setItems(data); 
      } 
      setLoading(false); 
    } 
    fetchPortfolios(); 
  }, []); 

  const filteredItems = items.filter((item) => item.category === activeTab); 
  const p = useTranslations('Portfolio'); 

  const CATEGORIES = [ 
    { id: "websites", label: p('websites') }, 
    { id: "tg-bots", label: p('tg_bots') }, 
    { id: "mobile", label: p('mobile') }, 
    { id: "ai-automation", label: p('automation') }, 
    { id: "others", label: p('others') }, 
  ]; 

  return ( 
    <div className="space-y-12 w-full max-w-5xl mx-auto"> 
      
      {/* Header Section */} 
      <header className="border-b border-black/10 dark:border-white/10 pb-5 flex flex-col gap-2"> 
        <div className="flex items-center gap-3"> 
          <div className="w-1 h-7 bg-red-600 rounded-sm"></div>  
          <h2 className="text-3xl font-extrabold tracking-tight text-black dark:text-white">{p('title')}</h2> 
        </div> 

        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium ml-6">{p('title_description')}</p> 
      </header> 

      {/* Meta Project System Highlight Banner */} 
      <div className="border border-black/10 dark:border-white/10 bg-white dark:bg-black rounded-2xl p-7 space-y-5 transition-all duration-500 hover:border-red-600/30 dark:hover:border-red-600/30 hover:shadow-[0_0_30px_-5px_rgba(220,38,38,0.15)]"> 
        <div className="flex items-center gap-3"> 
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse opacity-70" /> 
          <h3 className="text-sm font-extrabold text-black dark:text-white tracking-widest uppercase">ALT {p('meta_website')}</h3> 
        </div> 

        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg text-justify transition-colors duration-300">
          {p.rich('meta_description', { 
            toolLink: (chunks) => ( 
              <Link  
                href="/tools"  
                className="font-bold text-neutral-900 dark:text-neutral-100 hover:text-red-600 transition-colors" 
              > 
                {chunks} 
              </Link> 
            ) 
          })} 
        </p> 
        <div className="flex flex-wrap gap-2 pt-2"> 
          <span className="bg-neutral-50 dark:bg-neutral-900 border border-black/5 dark:border-white/10 text-[10px] font-bold px-3 py-1.5 text-neutral-600 dark:text-neutral-400 rounded-md uppercase tracking-wider">Next.js</span> 
          <span className="bg-neutral-50 dark:bg-neutral-900 border border-black/5 dark:border-white/10 text-[10px] font-bold px-3 py-1.5 text-neutral-600 dark:text-neutral-400 rounded-md uppercase tracking-wider">App Router</span> 
          <span className="bg-neutral-50 dark:bg-neutral-900 border border-black/5 dark:border-white/10 text-[10px] font-bold px-3 py-1.5 text-neutral-600 dark:text-neutral-400 rounded-md uppercase tracking-wider">Supabase</span> 
          <span className="bg-neutral-50 dark:bg-neutral-900 border border-black/5 dark:border-white/10 text-[10px] font-bold px-3 py-1.5 text-neutral-600 dark:text-neutral-400 rounded-md uppercase tracking-wider">NextAuth</span> 
        </div> 
      </div> 

      {/* High Contrast Tabs */} 
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1 border-b border-black/10 dark:border-white/10 pb-px text-center"> 
        {CATEGORIES.map((tab) => ( 
          <button 
            key={tab.id} 
            id={tab.id} 
            onClick={() => handleTabSwitch(tab.id)} 
            className={`text-[11px] sm:text-sm font-bold py-3 px-2 border-b-[3px] transition-all truncate scroll-mt-32 ${ 
              activeTab === tab.id 
                ? "border-red-600 text-neutral-900 dark:text-neutral-100 hover:text-red-600 dark:hover:text-red-600" 
                : "border-transparent text-neutral-400 hover:text-black dark:hover:text-white hover:border-black/20 dark:hover:border-white/20"
            }`} 
          > 
            {tab.label} 
          </button> 
        ))} 
      </div> 

      {loading ? ( 
        <div className="text-sm font-medium text-neutral-500 py-10"></div> 
      ) : filteredItems.length === 0 ? ( 
        <div className="text-sm font-medium text-neutral-500 py-10">{p('no_project_records')}</div> 
      ) : ( 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full pt-4"> 
          {filteredItems.map((item) => { 
            const directFavicon = item.link ? `${item.link.replace(/\/$/, "")}/favicon.ico` : null; 
            const handleIconError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => { 
              const img = e.currentTarget; 
              const cleanDomain = item.link ? item.link.replace(/^(https?:\/\/)?(www\.)?/, "") : ""; 
              if (cleanDomain && !img.src.includes("google.com/s2/favicons")) { 
                img.src = `https://www.google.com/s2/favicons?sz=64&domain=${cleanDomain}`; 
              } else { 
                img.style.display = "none"; 
              } 
            }; 

            // Dynamically assign outer tag so the whole card acts as a link if item.link exists
            const CardWrapper = item.link ? "a" : "div";
            const wrapperProps = item.link ? { href: item.link, target: "_blank", rel: "noreferrer" } : {};

            return ( 
              <CardWrapper 
                key={item.id} 
                {...(wrapperProps as any)}
                // Added active: scale and border classes for mobile touch feedback alongside standard hover states
                className="group block border-2 border-black/5 dark:border-white/5 rounded-2xl bg-white dark:bg-black transition-all duration-500 flex flex-col justify-between overflow-hidden hover:-translate-y-1 hover:border-red-600/50 dark:hover:border-red-600/50 hover:shadow-[0_10px_40px_-10px_rgba(220,38,38,0.2)] dark:hover:shadow-[0_10px_40px_-10px_rgba(220,38,38,0.3)] active:scale-[0.98] active:border-red-600/50 active:shadow-md cursor-pointer touch-manipulation"
              > 
                <div className="p-7 space-y-6"> 
                  
                  <div className="flex items-start justify-between gap-4"> 
                    <div className="flex items-center gap-4 min-w-0"> 
                      {directFavicon && ( 
                        <div className="w-10 h-10 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-black/10 dark:border-white/10 p-2 flex items-center justify-center shrink-0 shadow-sm"> 
                          <Image  
                            src={directFavicon}  
                            alt=""  
                            unoptimized 
                            width={24} 
                            height={24} 
                            className="object-contain" 
                            onError={handleIconError} 
                          /> 
                        </div> 
                      )} 
                      <h3 className="text-lg font-extrabold text-black dark:text-white truncate">{item.title}</h3> 
                    </div> 
                    {item.link && ( 
                      // Switched from <a> to <div> to prevent illegal nested anchors while keeping the same visual design
                      <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 group-hover:text-red-700 transition-colors pt-2"> 
                        {p('launch')} 
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"> 
                          <path d="M5 12h14"/> 
                          <path d="m12 5 7 7-7 7"/> 
                        </svg> 
                      </div> 
                    )} 
                  </div> 

                  {item.images && item.images.length > 0 && ( 
                    <div className="grid grid-cols-3 gap-3 my-5"> 
                      {item.images.map((imgUrl, idx) => ( 
                        <div key={idx} className="w-full h-20 border border-black/10 dark:border-white/10 rounded-xl bg-neutral-100 dark:bg-neutral-900 relative overflow-hidden group-hover:border-black/20 dark:group-hover:border-white/20 transition-colors"> 
                          <Image  
                            src={imgUrl}  
                            alt=""  
                            unoptimized 
                            fill 
                            className="object-cover" 
                          /> 
                        </div> 
                      ))} 
                    </div> 
                  )} 

                  <div className="flex flex-wrap gap-2 pt-2"> 
                    {item.tags?.map((tag, idx) => ( 
                      <span  
                        key={idx}  
                        className="bg-neutral-50 dark:bg-neutral-900 border border-black/5 dark:border-white/10 text-[10px] font-bold px-3 py-1.5 text-neutral-600 dark:text-neutral-400 rounded-md uppercase tracking-wider" 
                      > 
                        {tag} 
                      </span> 
                    ))} 
                  </div> 
                </div> 
              </CardWrapper> 
            ); 
          })} 
        </div> 
      )} 
    </div> 
  ); 
}