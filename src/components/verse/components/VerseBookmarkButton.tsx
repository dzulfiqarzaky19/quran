"use client";

import { Bookmark } from "lucide-react";
import { useReadingStore } from "@/store/reading";

interface VerseBookmarkButtonProps {
  surahNo: number;
  ayahNo: number;
}

export const VerseBookmarkButton = ({ surahNo, ayahNo }: VerseBookmarkButtonProps) => {
  const isBookmarked = useReadingStore((state) =>
    state.bookmarks.some((b) => b.surahNo === surahNo && b.ayahNo === ayahNo),
  );
  const toggleBookmark = useReadingStore((state) => state.toggleBookmark);

  return (
    <button
      type="button"
      onClick={() => toggleBookmark({ surahNo, ayahNo })}
      aria-pressed={isBookmarked}
      aria-label="Bookmark verse"
      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors active:scale-[0.98] ${
        isBookmarked
          ? "text-primary"
          : "text-on-surface-variant hover:bg-surface-container-highest hover:text-primary"
      }`}
    >
      <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
    </button>
  );
};
