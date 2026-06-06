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
  { id: "tg-bots", label: "Telegram Bots" },
  { id: "mobile", label: "Mobile Apps" },
  { id: "ai-automation", label: "AI & Automation" },
  { id: "others", label: "Other Projects" },
];

export function PortfolioManager() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [currentId, setCurrentId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [category, setCategory] = useState("websites");
  const [tagsInput, setTagsInput] = useState("");
  const [imagesInput, setImagesInput] = useState("");

  useEffect(() => {
    fetchPortfolios();
  }, []);

  async function fetchPortfolios() {
    setLoading(true);
    const { data, error } = await supabase
      .from("portfolios")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (!error && data) setItems(data);
    setLoading(false);
  }

  const handleCheckboxChange = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(items.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const openInsertModal = () => {
    setCurrentId(null);
    setTitle("");
    setLink("");
    setCategory("websites");
    setTagsInput("");
    setImagesInput("");
    setIsModalOpen(true);
  };

  const openUpdateModal = () => {
    if (selectedIds.length !== 1) return;
    const match = items.find((item) => item.id === selectedIds[0]);
    if (!match) return;

    setCurrentId(match.id);
    setTitle(match.title);
    setLink(match.link || "");
    setCategory(match.category);
    setTagsInput(match.tags ? match.tags.join(", ") : "");
    setImagesInput(match.images ? match.images.join(", ") : "");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let formattedUrl = link.trim();
    if (formattedUrl && !/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const formattedTags = tagsInput.split(",").map((t) => t.trim()).filter((t) => t !== "");
    const formattedImages = imagesInput.split(",").map((i) => i.trim()).filter((i) => i !== "");

    const payload = {
      title,
      link: formattedUrl,
      category,
      tags: formattedTags,
      images: formattedImages,
    };

    if (currentId) {
      await supabase.from("portfolios").update(payload).eq("id", currentId);
    } else {
      await supabase.from("portfolios").insert([payload]);
    }

    setIsModalOpen(false);
    setSelectedIds([]);
    fetchPortfolios();
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Confirm purging ${selectedIds.length} operational record(s)?`)) return;

    const { error } = await supabase.from("portfolios").delete().in("id", selectedIds);
    if (!error) {
      setSelectedIds([]);
      fetchPortfolios();
    }
  };

  return (
    <div className="space-y-6">
      <header className="border-b border-neutral-200 dark:border-neutral-800 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-mono font-bold text-black dark:text-white">/admin/portfolio</h1>
          <p className="text-xs text-neutral-500 mt-1">Direct Mutation Control Interface</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={openInsertModal} className="flex-1 sm:flex-none bg-neutral-800 dark:bg-neutral-100 text-white dark:text-neutral-950 font-mono text-xs font-bold px-3 py-1.5 rounded hover:bg-black dark:hover:bg-neutral-200 transition">
            New Record
          </button>
          <button 
            onClick={openUpdateModal} 
            disabled={selectedIds.length !== 1}
            className="flex-1 sm:flex-none border border-neutral-300 dark:border-neutral-800 font-mono text-xs font-bold px-3 py-1.5 rounded hover:border-neutral-400 dark:hover:border-neutral-700 disabled:opacity-40 disabled:hover:border-neutral-300 dark:disabled:hover:border-neutral-800 transition text-neutral-700 dark:text-neutral-300"
          >
            Edit
          </button>
          <button 
            onClick={handleDeleteSelected}
            disabled={selectedIds.length === 0}
            className="flex-1 sm:flex-none border border-red-900/50 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 font-mono text-xs font-bold px-3 py-1.5 rounded hover:bg-red-100 dark:hover:bg-red-950/40 disabled:opacity-40 transition"
          >
            Delete ({selectedIds.length})
          </button>
        </div>
      </header>

      {loading ? (
        <div className="text-xs font-mono text-neutral-500">Querying live schema matrix...</div>
      ) : (
        <div className="border border-neutral-200 dark:border-neutral-800 rounded overflow-x-auto bg-white dark:bg-neutral-950 shadow-sm dark:shadow-none">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 text-xs font-mono text-neutral-600 dark:text-neutral-400">
                <th className="p-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll} 
                    checked={items.length > 0 && selectedIds.length === items.length}
                    className="accent-black dark:accent-neutral-100"
                  />
                </th>
                <th className="p-4 w-12">Logo</th>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Target Source Link</th>
                <th className="p-4">Stack Tags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-sm">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs font-mono text-neutral-500">No database rows returned.</td>
                </tr>
              ) : (
                items.map((item) => {
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
                    <tr key={item.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/20 transition">
                      <td className="p-4 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.includes(item.id)}
                          onChange={() => handleCheckboxChange(item.id)}
                          className="accent-black dark:accent-neutral-100"
                        />
                      </td>
                      <td className="p-4">
                        {directFavicon ? (
                          <div className="w-5 h-5 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-0.5 flex items-center justify-center relative">
                            <Image 
                              src={directFavicon} 
                              alt="" 
                              unoptimized
                              width={20}
                              height={20}
                              className="object-contain"
                              onError={handleIconError}
                            />
                          </div>
                        ) : (
                          <span className="text-neutral-400 dark:text-neutral-600 font-mono text-xs">-</span>
                        )}
                      </td>
                      <td className="p-4 font-bold font-mono text-black dark:text-neutral-200">{item.title}</td>
                      <td className="p-4 text-xs font-mono text-neutral-500 dark:text-neutral-400">
                        {CATEGORIES.find(c => c.id === item.category)?.label || item.category}
                      </td>
                      <td className="p-4 text-neutral-500 dark:text-neutral-400 font-mono text-xs truncate max-w-xs">
                        {item.link ? (
                          <a href={item.link} target="_blank" rel="noreferrer" className="hover:text-black dark:hover:text-neutral-200 underline decoration-neutral-300 dark:decoration-neutral-800">
                            {item.link}
                          </a>
                        ) : (
                          <span className="text-neutral-400 dark:text-neutral-600">none</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {item.tags?.map((tag, idx) => (
                            <span key={idx} className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[10px] px-1.5 py-0.5 font-mono text-neutral-600 dark:text-neutral-400 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Input Modal View with .dropdown-reveal integration */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded p-6 max-w-md w-full space-y-4 shadow-xl dropdown-reveal">
            <div>
              <h3 className="font-mono text-sm font-bold text-black dark:text-neutral-200">
                {currentId ? "Modify Portfolio Entry" : "Append Portfolio Entry"}
              </h3>
            </div>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-500 dark:text-neutral-400">Project Title</label>
                <input 
                  type="text" 
                  required 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-3 py-1.5 text-sm outline-none focus:border-red-600 dark:focus:border-red-600 text-black dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-500 dark:text-neutral-400">Project Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-3 py-1.5 text-sm outline-none focus:border-red-600 dark:focus:border-red-600 font-mono text-black dark:text-neutral-300"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-500 dark:text-neutral-400">Launch Link URL</label>
                <input 
                  type="text" 
                  value={link} 
                  onChange={(e) => setLink(e.target.value)} 
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-3 py-1.5 text-sm outline-none focus:border-red-600 dark:focus:border-red-600 text-black dark:text-white"
                  placeholder="c-abyss.vercel.app"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-500 dark:text-neutral-400">Tech Stack Tags <span className="text-neutral-400 dark:text-neutral-600">(Comma separated)</span></label>
                <input 
                  type="text" 
                  placeholder="React, Next.js, PHP"
                  value={tagsInput} 
                  onChange={(e) => setTagsInput(e.target.value)} 
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-3 py-1.5 text-sm outline-none focus:border-red-600 dark:focus:border-red-600 text-black dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-500 dark:text-neutral-400">Image Asset URLs <span className="text-neutral-400 dark:text-neutral-600">(Comma separated)</span></label>
                <textarea 
                  rows={2}
                  placeholder="https://site.com/img1.png"
                  value={imagesInput} 
                  onChange={(e) => setImagesInput(e.target.value)} 
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-3 py-1.5 text-sm outline-none focus:border-red-600 dark:focus:border-red-600 resize-none text-black dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="border border-neutral-200 dark:border-neutral-800 font-mono text-xs px-3 py-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 font-mono text-xs font-bold px-4 py-2 rounded hover:bg-black dark:hover:bg-neutral-200 transition"
                >
                  Commit Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}