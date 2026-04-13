"use client";
import { useAppStore } from "@/store";
import { useShallow } from "zustand/react/shallow";
import { memo } from "react";
import { VerseHeader } from "./components/VerseHeader";
import { VerseContent } from "./components/VerseContent";
import { VerseFooter } from "./components/VerseFooter";

import { VerseWord } from "@/lib/types";

interface VerseCardProps {
  surahNo: number;
  ayahNo: number;
  arabic: string;
  english: string;
  indonesian: string;
  tajweedData: string;
  words?: VerseWord[];
}

export const VerseCard = memo(function Verse({
  surahNo,
  ayahNo,
  arabic,
  english,
  indonesian,
  tajweedData,
  words,
}: VerseCardProps) {
  const { isReading, isPlayingAyah } = useAppStore(
    useShallow((state) => ({
      isReading: state.activeVerse === ayahNo,
      isPlayingAyah: state.activeAudioAyah === ayahNo,
    })),
  );

  return (
    <div
      id={`verse-${ayahNo}`}
      className={`relative w-full rounded-3xl p-6 md:p-8 transition-all duration-300 ${
        isReading || isPlayingAyah
          ? "bg-surface-container-highest shadow-xl ring-1 ring-primary/20"
          : "bg-surface-container hover:bg-surface-container-high"
      }`}
    >
      <VerseHeader surahNo={surahNo} ayahNo={ayahNo} />

      <VerseContent
        ayahNo={ayahNo}
        arabic={arabic}
        english={english}
        indonesian={indonesian}
        tajweedData={tajweedData}
        words={words}
      />

      <VerseFooter ayahNo={ayahNo} />
    </div>
  );
});
