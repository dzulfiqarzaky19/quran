"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/store";
import { useShallow } from "zustand/react/shallow";

export function WordHighlightManager() {
  const lastActiveAyah = useRef<number | null>(null);
  const lastActiveWord = useRef<number | null>(null);

  const { activeAudioAyah, activeAudioWord, isPlaying } = useAppStore(
    useShallow((state) => ({
      activeAudioAyah: state.activeAudioAyah,
      activeAudioWord: state.activeAudioWord,
      isPlaying: state.isPlaying,
    })),
  );

  useEffect(() => {
    // 1. Clear previous highlights
    if (lastActiveAyah.current !== null) {
      const prevVerse = document.getElementById(`verse-${lastActiveAyah.current}`);
      prevVerse?.classList.remove("verse-active");
    }
    
    document.querySelector(".word-active")?.classList.remove("word-active");

    // 2. Apply new highlights
    if (activeAudioAyah && isPlaying) {
      const currentVerse = document.getElementById(`verse-${activeAudioAyah}`);
      if (currentVerse) {
        currentVerse.classList.add("verse-active");
        
        // Auto-scroll logic — only if ayah changed
        if (lastActiveAyah.current !== activeAudioAyah) {
          currentVerse.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }

      if (activeAudioWord) {
        const currentWord = document.querySelector(
          `[data-ayah="${activeAudioAyah}"][data-word="${activeAudioWord}"]`
        );
        currentWord?.classList.add("word-active");
      }
    }

    lastActiveAyah.current = activeAudioAyah;
    lastActiveWord.current = activeAudioWord;
  }, [activeAudioAyah, activeAudioWord, isPlaying]);

  return null;
}
