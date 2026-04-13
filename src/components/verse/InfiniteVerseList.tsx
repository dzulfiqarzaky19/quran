"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { VerseCard } from "./VerseCard";
import { fetchVerses } from "@/lib/api";
import { Verse } from "@/lib/types";
import { useAppStore } from "@/store";

interface InfiniteVerseListProps {
  surahNo: number;
  initialVerses: Verse[];
  initialPage: number;
  totalPages: number;
  initialTajweedData: string[];
}

export function InfiniteVerseList({
  surahNo,
  initialVerses,
  initialPage,
  totalPages,
  initialTajweedData,
}: InfiniteVerseListProps) {
  const [verses, setVerses] = useState<Verse[]>(initialVerses);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPage < totalPages);

  const setStoreTajweedData = useAppStore((state) => state.setTajweedData);
  const tajweedData = useAppStore((state) => state.tajweedData);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialTajweedData) {
      setStoreTajweedData(initialTajweedData);
    }
  }, [initialTajweedData, setStoreTajweedData]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const response = await fetchVerses(surahNo, nextPage);

      setVerses((prev) => [...prev, ...response.verses]);
      setPage(nextPage);
      setHasMore(nextPage < response.pagination.total_pages);
    } catch (error) {
      console.error("Failed to load more verses:", error);
    } finally {
      setLoading(false);
    }
  }, [surahNo, page, loading, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {verses.map((verse) => {
        const indonesian = 
          verse.translations?.find((t) => t.resource_id === 33)?.text || "";
        
        return (
          <VerseCard
            key={verse.id}
            surahNo={surahNo}
            ayahNo={verse.verse_number}
            arabic={verse.text_uthmani}
            english={verse.translations?.find((t) => t.id === 131)?.text || ""}
            indonesian={indonesian}
            tajweedData={tajweedData ? tajweedData[verse.verse_number - 1] : ""}
            words={verse.words || []}
          />
        );
      })}

      {hasMore && (
        <div
          ref={observerTarget}
          className="h-20 flex items-center justify-center"
        >
          {loading && (
            <div className="flex items-center gap-2 text-on-surface-variant/50">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
