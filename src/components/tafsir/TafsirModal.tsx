"use client";
import { useAppStore } from "@/store";
import { useEffect, useState } from "react";
import { fetchTafsir } from "@/lib/api";
import { TafsirResponse } from "@/lib/types";
import { TafsirContent } from "./TafsirContent";

export function TafsirModal() {
  const {
    tafsirOpen,
    tafsirVerse,
    closeTafsir,
    tafsirSource,
    setTafsirSource,
  } = useAppStore();
  const [data, setData] = useState<TafsirResponse | null>(null);
  const [loading, setLoading] = useState(false);

  console.log(tafsirVerse);

  useEffect(() => {
    if (tafsirOpen && tafsirVerse) {
      setLoading(true);
      fetchTafsir(tafsirVerse.surah, tafsirVerse.ayah)
        .then((res) => setData(res))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setData(null);
    }
  }, [tafsirOpen, tafsirVerse]);

  if (!tafsirOpen || !tafsirVerse) return null;

  const currentTafsir =
    data?.tafsirs.find(
      (t) => t.author.toLowerCase().replace(/\s+/g, "-") === tafsirSource,
    ) || data?.tafsirs[0];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6">
      <div
        className="absolute inset-0 bg-surface-dim/80 backdrop-blur-sm"
        onClick={closeTafsir}
      />

      <div className="relative w-full h-full md:h-auto md:max-w-5xl md:max-h-[90vh] glass md:rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
        <div className="w-full md:w-72 bg-surface-container/80 p-6 flex flex-col border-r border-outline-variant/15 shrink-0">
          <div className="flex justify-between flex-row-reverse md:flex-row items-center mb-8">
            <h3 className="text-label-sm tracking-[0.1em] text-primary font-bold uppercase">
              Deep Study
            </h3>
            <button
              onClick={closeTafsir}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant md:hidden transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mb-8 md:mb-12">
            <div className="text-body-sm text-on-surface-variant uppercase tracking-widest mb-2 font-bold">
              Surah : Ayah
            </div>
            <div className="text-display-lg font-bold text-on-surface leading-none">
              {tafsirVerse.surah} : {tafsirVerse.ayah}
            </div>
          </div>

          <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide">
            {["Ibn Kathir", "Maarif Ul Quran", "Tazkirul Quran"].map(
              (source) => {
                const sourceKey = source.toLowerCase().replace(/\s+/g, "-");
                const isActive = tafsirSource === sourceKey;
                return (
                  <button
                    key={sourceKey}
                    onClick={() => setTafsirSource(sourceKey)}
                    className={`text-left px-5 py-4 text-label-sm font-bold tracking-[0.05em] uppercase rounded-xl transition-all whitespace-nowrap md:whitespace-normal ${isActive ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"}`}
                  >
                    {source}
                  </button>
                );
              },
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden bg-surface-bright/50">
          <div className="hidden md:flex justify-end p-4 shrink-0 border-b border-outline-variant/15">
            <button
              onClick={closeTafsir}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-12">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center gap-6 text-on-surface-variant">
                <div className="w-10 h-10 rounded-full border-4 border-surface-container-highest border-t-primary animate-spin" />
                <p className="text-label-sm uppercase tracking-widest font-bold">
                  Loading Tafsir...
                </p>
              </div>
            ) : data && currentTafsir ? (
              <div className="animate-in fade-in duration-300">
                <TafsirContent
                  content={currentTafsir.content}
                  author={currentTafsir.author}
                />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-on-surface-variant text-body-lg gap-4">
                <svg
                  className="w-12 h-12 opacity-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                Tafsir narrative not available for this verse.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
