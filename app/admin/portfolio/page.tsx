"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form Field States
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");

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
    setDescription("");
    setTagsInput("");
    setIsModalOpen(true);
  };

  const openUpdateModal = () => {
    if (selectedIds.length !== 1) return;
    const itemToEdit = items.find((item) => item.id === selectedIds[0]);
    if (!itemToEdit) return;

    setCurrentId(itemToEdit.id);
    setTitle(itemToEdit.title);
    setDescription(itemToEdit.description || "");
    setTagsInput(itemToEdit.tags ? itemToEdit.tags.join(", ") : "");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedTags = tagsInput.split(",").map((t) => t.trim()).filter((t) => t !== "");

    const payload = {
      title,
      description,
      tags: formattedTags,
    };

    if (currentId) {
      // Update Mode
      await supabase.from("portfolios").update(payload).eq("id", currentId);
    } else {
      // Insert Mode
      await supabase.from("portfolios").insert([payload]);
    }

    setIsModalOpen(false);
    setSelectedIds([]);
    fetchPortfolios();
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Confirm deletion of ${selectedIds.length} item(s)?`)) return;

    const { error } = await supabase.from("portfolios").delete().in("id", selectedIds);
    if (!error) {
      setSelectedIds([]);
      fetchPortfolios();
    }
  };

  return (
    <div className="space-y-6">
      <header className="border-b border-neutral-800 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-mono font-bold">/admin/portfolio</h1>
          <p className="text-xs text-neutral-500 mt-1">Direct Mutation Control Interface</p>
        </div>
        <div className="flex gap-2">
          <button onClick={openInsertModal} className="bg-neutral-100 text-neutral-950 font-mono text-xs font-bold px-3 py-1.5 rounded hover:bg-neutral-200 transition">
            New Record
          </button>
          <button 
            onClick={openUpdateModal} 
            disabled={selectedIds.length !== 1}
            className="border border-neutral-800 font-mono text-xs font-bold px-3 py-1.5 rounded hover:border-neutral-700 disabled:opacity-40 disabled:hover:border-neutral-800 transition text-neutral-300"
          >
            Edit
          </button>
          <button 
            onClick={handleDeleteSelected}
            disabled={selectedIds.length === 0}
            className="border border-red-900/50 bg-red-950/20 text-red-400 font-mono text-xs font-bold px-3 py-1.5 rounded hover:bg-red-950/40 disabled:opacity-40 disabled:hover:bg-red-950/20 transition"
          >
            Delete ({selectedIds.length})
          </button>
        </div>
      </header>

      {loading ? (
        <div className="text-xs font-mono text-neutral-500">Querying remote index...</div>
      ) : (
        <div className="border border-neutral-800 rounded overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-900/40 text-xs font-mono text-neutral-400">
                <th className="p-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll} 
                    checked={items.length > 0 && selectedIds.length === items.length}
                    className="accent-neutral-100"
                  />
                </th>
                <th className="p-4">Title</th>
                <th className="p-4">Description</th>
                <th className="p-4">Stack Tags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 text-sm">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-xs font-mono text-neutral-500">No database rows returned.</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-900/20 transition">
                    <td className="p-4 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleCheckboxChange(item.id)}
                        className="accent-neutral-100"
                      />
                    </td>
                    <td className="p-4 font-bold font-mono text-neutral-200">{item.title}</td>
                    <td className="p-4 text-neutral-400 max-w-xs truncate">{item.description}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {item.tags?.map((tag, idx) => (
                          <span key={idx} className="bg-neutral-900 border border-neutral-800 text-[10px] px-1.5 py-0.5 font-mono text-neutral-400 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Unified Input Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-950 border border-neutral-800 rounded p-6 max-w-md w-full space-y-4 shadow-xl">
            <div>
              <h3 className="font-mono text-sm font-bold text-neutral-200">
                {currentId ? "Modify Portfolio Entry" : "Append Portfolio Entry"}
              </h3>
              <p className="text-[11px] text-neutral-500 font-mono mt-0.5">Commit updates to remote PostgreSQL tables</p>
            </div>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">Project Title</label>
                <input 
                  type="text" 
                  required 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-1.5 text-sm outline-none focus:border-neutral-700"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">Description</label>
                <textarea 
                  rows={3}
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-1.5 text-sm outline-none focus:border-neutral-700 resize-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">Tech Tags <span className="text-neutral-600">(Comma separated)</span></label>
                <input 
                  type="text" 
                  placeholder="Next.js, TypeScript, PostgreSQL"
                  value={tagsInput} 
                  onChange={(e) => setTagsInput(e.target.value)} 
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-1.5 text-sm outline-none focus:border-neutral-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="border border-neutral-800 font-mono text-xs px-3 py-2 rounded hover:bg-neutral-900 text-neutral-400"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-neutral-100 text-neutral-950 font-mono text-xs font-bold px-4 py-2 rounded hover:bg-neutral-200 transition"
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