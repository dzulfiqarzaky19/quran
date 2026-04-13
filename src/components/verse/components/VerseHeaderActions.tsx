"use client";

import { Play, Pause } from "lucide-react";
import { useAppStore } from "@/store";
import { useShallow } from "zustand/react/shallow";

interface VerseHeaderActionsProps {
  surahNo: number;
  ayahNo: number;
}

export const VerseHeaderActions = ({ surahNo, ayahNo }: VerseHeaderActionsProps) => {
  const { isPlaying, isPlayingAyah, setIsPlaying, audioData } = useAppStore(
    useShallow((state) => {
      const isThisAyah = state.activeAudioAyah === ayahNo;
      return {
        isPlayingAyah: isThisAyah,
        isPlaying: isThisAyah ? state.isPlaying : false,
        setIsPlaying: state.setIsPlaying,
        audioData: state.audioData,
      };
    }),
  );

  const isActuallyPlaying = isPlayingAyah && isPlaying;

  const handlePlayFromHere = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioData) return;

    if (isPlayingAyah && isPlaying) {
      setIsPlaying(false);
      return;
    }

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
    }
  };

  return (
    <button
      onClick={handlePlayFromHere}
      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
        isActuallyPlaying
          ? "bg-primary text-surface shadow-lg shadow-primary/20 scale-105"
          : "text-on-surface-variant hover:bg-surface-container-highest hover:text-primary"
      }`}
      title={isActuallyPlaying ? "Pause" : "Play"}
    >
      {isActuallyPlaying ? (
        <Pause className="w-5 h-5 fill-current" />
      ) : (
        <Play className="w-5 h-5 ml-0.5" />
      )}
    </button>
  );
}
