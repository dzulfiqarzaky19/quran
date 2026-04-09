"use client";
import { useAppStore } from "@/store";
import { useShallow } from "zustand/react/shallow";
import Link from "next/link";
import { memo, useMemo } from "react";
import { ArabicWord } from "./ArabicWord";
import { getTajweedWords } from "@/utils/tajweed";

interface VerseCardProps {
  surahNo: number;
  ayahNo: number;
  arabic: string;
  english: string;
  indonesian: string;
}

export const VerseCard = memo(function Verse({
  surahNo,
  ayahNo,
  arabic,
  english,
  indonesian,
}: VerseCardProps) {
  const { isReading, isPlayingAyah, isPlaying, activeAudioWord, tajweedData } =
    useAppStore(
      useShallow((state) => {
        const isThisAyah = state.activeAudioAyah === ayahNo;

        return {
          isReading: state.activeVerse === ayahNo,
          isPlayingAyah: isThisAyah,
          isPlaying: isThisAyah ? state.isPlaying : false,
          activeAudioWord: isThisAyah ? state.activeAudioWord : null,
          tajweedData: state.tajweedData,
        };
      }),
    );

  const audioData = useAppStore((state) => state.audioData);
  const setActiveVerse = useAppStore((state) => state.setActiveVerse);
  const setIsPlaying = useAppStore((state) => state.setIsPlaying);

  const handlePlayFromHere = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioData) return;

    const timestamp = audioData.audio_file.timestamps.find(
      (ts) => ts.verse_key === `${surahNo}:${ayahNo}`,
    );

    if (timestamp) {
      document.dispatchEvent(
        new CustomEvent("audio-seek", {
          detail: timestamp.timestamp_from / 1000,
        }),
      );
      setIsPlaying(true);
      setActiveVerse(ayahNo);
    }
  };

  const tajweedWords = useMemo(() => {
    const displayText = tajweedData ? tajweedData[ayahNo - 1] : arabic;
    const words = getTajweedWords(displayText);

    let counter = 0;
    return words.map((word) => {
      if (!word.isStopMark) counter++;
      return {
        ...word,
        wordId: word.isStopMark ? null : counter,
      };
    });
  }, [tajweedData, arabic, ayahNo]);

  return (
    <div
      id={`verse-${ayahNo}`}
      className={`relative w-full rounded-2xl p-6 md:p-8 transition-all duration-300 ${isReading || isPlayingAyah ? "bg-surface-container-highest shadow-[inset_3px_0_0_0_var(--color-primary)] ring-1 ring-outline-variant/10" : "bg-surface-container hover:bg-surface-container-high"}`}
      onClick={() => setActiveVerse(ayahNo)}
    >
      <div className="flex flex-col md:flex-row-reverse gap-6 mb-8">
        <div className="flex flex-col items-center gap-4 shrink-0 self-end md:self-start">
          <div className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant">
            <span className="text-label-sm">{ayahNo}</span>
          </div>
          <button
            onClick={handlePlayFromHere}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isPlayingAyah && isPlaying ? "bg-primary text-surface" : "bg-surface-container-high text-primary hover:bg-primary hover:text-surface"}`}
          >
            {isPlayingAyah && isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 ml-0.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex-1 text-right" dir="rtl">
          <p className="text-title-lg font-arabic text-on-surface leading-[2.8] flex flex-wrap justify-start gap-x-2 gap-y-1">
            {tajweedWords.map((wordObj, idx) => (
              <ArabicWord
                key={idx}
                segments={wordObj.segments}
                isStopMark={wordObj.isStopMark}
                isHighlighted={
                  !wordObj.isStopMark &&
                  isPlayingAyah &&
                  activeAudioWord === wordObj.wordId
                }
              />
            ))}
          </p>
        </div>
      </div>

      <div className="md:pr-16">
        <p
          className={`text-body-lg mb-3 transition-colors ${isPlayingAyah ? "text-primary font-medium" : "text-on-surface"}`}
        >
          {english}
        </p>
        <p className="text-body-sm text-on-surface-variant italic mb-8">
          {indonesian}
        </p>

        <div className="flex flex-wrap gap-6 border-t border-outline-variant/15 pt-4">
          <Link
            href={`?tafsir=${ayahNo}`}
            scroll={false}
            onClick={(e) => e.stopPropagation()}
            className="text-label-sm font-bold tracking-[0.05em] text-primary hover:text-primary-container transition-colors uppercase"
          >
            Tafsir
          </Link>
          <button className="text-label-sm font-bold tracking-[0.05em] text-on-surface-variant hover:text-on-surface transition-colors uppercase">
            Pelajaran
          </button>
          <button className="text-label-sm font-bold tracking-[0.05em] text-on-surface-variant hover:text-on-surface transition-colors uppercase">
            Refleksi
          </button>
        </div>
      </div>
    </div>
  );
});
