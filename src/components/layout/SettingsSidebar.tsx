"use client";

import { useAppStore } from "@/store";
import { X, Check, Search, Music, Languages } from "lucide-react";
import { useState, useMemo } from "react";
import { RecitationResource, TranslationResource } from "@/lib/types";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";

interface SettingsSidebarProps {
  initialRecitations?: RecitationResource[];
  initialTranslations?: TranslationResource[];
}

export function SettingsSidebar({ 
  initialRecitations = [], 
  initialTranslations = [] 
}: SettingsSidebarProps) {
  const { isSettingsOpen, setIsSettingsOpen } = useAppStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState<"reciter" | "translation">("reciter");
  const [search, setSearch] = useState("");
  
  // Optimistic Selection State (only active during transition)
  const [optimisticReciter, setOptimisticReciter] = useState<number | null>(null);
  const [optimisticTranslation, setOptimisticTranslation] = useState<number | null>(null);

  const reciterId = (isPending && optimisticReciter !== null) 
    ? optimisticReciter 
    : (Number(searchParams.get("reciter")) || 7);
    
  const translationId = (isPending && optimisticTranslation !== null)
    ? optimisticTranslation
    : (Number(searchParams.get("trans")) || 33);

  const updateSetting = (key: string, value: number) => {
    if (key === "reciter") setOptimisticReciter(value);
    if (key === "trans") setOptimisticTranslation(value);

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, value.toString());
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const filteredRecitations = useMemo(() => {
    return initialRecitations.filter(r => 
      r.reciter_name.toLowerCase().includes(search.toLowerCase())
    );
  }, [initialRecitations, search]);

  const filteredTranslations = useMemo(() => {
    return initialTranslations.filter(t => 
      t.name.toLowerCase().includes(search.toLowerCase()) || 
      t.language_name.toLowerCase().includes(search.toLowerCase())
    );
  }, [initialTranslations, search]);

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-surface-dim/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setIsSettingsOpen(false)}
      />

      {/* Sidebar */}
      <div className="relative w-full sm:w-[400px] h-full bg-surface-container-lowest/90 backdrop-blur-xl border-l border-outline-variant/15 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-outline-variant/15 flex items-center justify-between">
          <h2 className="text-title-lg font-bold tracking-tight">Settings</h2>
          <button 
            onClick={() => setIsSettingsOpen(false)}
            className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 bg-surface-container-low/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input 
              type="text"
              placeholder={`Search ${activeTab === "reciter" ? "reciters" : "translations"}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-container-highest rounded-xl py-2.5 pl-10 pr-4 text-body-md outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 pb-6 border-b border-outline-variant/15 flex gap-2">
          <button
            onClick={() => { setActiveTab("reciter"); setSearch(""); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-label-md transition-all border ${
              activeTab === "reciter"
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant border-outline-variant/15"
            }`}
          >
            <Music className="w-4 h-4" />
            Reciter
          </button>
          <button
            onClick={() => { setActiveTab("translation"); setSearch(""); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-label-md transition-all border ${
              activeTab === "translation"
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant border-outline-variant/15"
            }`}
          >
            <Languages className="w-4 h-4" />
            Translation
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar">
          {activeTab === "reciter" ? (
            filteredRecitations.map((r) => (
              <button
                key={r.id}
                onClick={() => updateSetting("reciter", r.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl text-left transition-all ${
                  reciterId === r.id 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "bg-surface-container hover:bg-surface-container-high"
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-body-md font-semibold">{r.reciter_name}</span>
                  <span className={`text-label-sm ${reciterId === r.id ? "text-white/70" : "text-on-surface-variant"}`}>
                    {r.style || "Standard"}
                  </span>
                </div>
                {reciterId === r.id && <Check className="w-5 h-5" />}
              </button>
            ))
          ) : (
            filteredTranslations.map((t) => (
              <button
                key={t.id}
                onClick={() => updateSetting("trans", t.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl text-left transition-all ${
                  translationId === t.id 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "bg-surface-container hover:bg-surface-container-high"
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-body-md font-semibold">{t.name}</span>
                  <span className={`text-label-sm ${translationId === t.id ? "text-white/70" : "text-on-surface-variant"}`}>
                    {t.language_name} • {t.author_name}
                  </span>
                </div>
                {translationId === t.id && <Check className="w-5 h-5" />}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
