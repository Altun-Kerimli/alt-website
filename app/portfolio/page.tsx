"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/app/lib/supabase";

interface PortfolioItem {
  id: string;
  title: string;
  link: string;
  category: string;
  tags: string[];
  images: string[];
}

const CATEGORIES = [
  { id: "websites", label: "Web Sites" },
  { id: "tg-bots", label: "Telegram" },
  { id: "mobile", label: "Mobile Apps" },
  { id: "ai-automation", label: "Automation" },
  { id: "others", label: "Others" },
];

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [activeTab, setActiveTab] = useState("websites");
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-8 w-full">
      <header className="border-b border-neutral-800 pb-4">
        <h1 className="text-xl font-mono font-bold">/portfolio</h1>
        <p className="text-xs text-neutral-500 mt-1">Selected technical works and deployments.</p>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1 border-b border-neutral-900 pb-px text-center">
        {CATEGORIES.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`font-mono text-[11px] sm:text-xs py-2.5 border-b-2 transition truncate ${
              activeTab === tab.id
                ? "border-neutral-100 text-neutral-100 font-bold bg-neutral-900/30"
                : "border-transparent text-neutral-500 hover:text-neutral-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-xs font-mono text-neutral-500">Loading catalog...</div>
      ) : filteredItems.length === 0 ? (
        <div className="text-xs font-mono text-neutral-500 py-6">No project records found under this track.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
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

            return (
              <div key={item.id} className="border border-neutral-800 rounded bg-neutral-900/10 flex flex-col justify-between overflow-hidden w-full">
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {directFavicon && (
                        <div className="w-6 h-6 rounded bg-neutral-900 border border-neutral-800 p-1 flex items-center justify-center shrink-0 relative">
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
                      <h2 className="text-base font-bold tracking-tight text-neutral-200 truncate">{item.title}</h2>
                    </div>
                    {item.link && (
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="font-mono text-xs text-neutral-400 hover:text-neutral-100 underline decoration-neutral-700 hover:decoration-neutral-400 shrink-0"
                      >
                        launch_src
                      </a>
                    )}
                  </div>

                  {item.images && item.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 my-2">
                      {item.images.map((imgUrl, idx) => (
                        <div key={idx} className="w-full h-14 sm:h-16 border border-neutral-800 rounded bg-neutral-900 relative overflow-hidden">
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

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tags?.map((tag, idx) => (
                      <span 
                        key={idx} 
                        className="bg-neutral-900 border border-neutral-800 text-[10px] px-2 py-0.5 font-mono text-neutral-400 rounded"
                      >
                        {tag.toLowerCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}