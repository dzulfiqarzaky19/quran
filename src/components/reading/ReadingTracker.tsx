"use client";

import { useEffect } from "react";
import { useReadingStore } from "@/store/reading";

interface ReadingTrackerProps {
  surahNo: number;
}

// Long enough that scrolling past a verse does not count as reading it
const DWELL_MS = 1000;

export const ReadingTracker = ({ surahNo }: ReadingTrackerProps) => {
  const markRead = useReadingStore((state) => state.markRead);

  useEffect(() => {
    // Verses stream in after navigation, so the browser has already given up on the hash
    const target = /^#verse-\d+$/.test(window.location.hash)
      ? document.getElementById(window.location.hash.slice(1))
      : null;
    target?.scrollIntoView();

    let timer: ReturnType<typeof setTimeout> | undefined;
    // A zero-height band at mid-screen: exactly one verse crosses it at a time
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries.find((e) => e.isIntersecting);
        if (!entry) return;

        const ayahNo = Number(entry.target.id.replace("verse-", ""));
        clearTimeout(timer);
        timer = setTimeout(() => markRead({ surahNo, ayahNo }), DWELL_MS);
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );

    document
      .querySelectorAll<HTMLElement>('section[id^="verse-"]')
      .forEach((verse) => observer.observe(verse));

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [surahNo, markRead]);

  return null;
};
