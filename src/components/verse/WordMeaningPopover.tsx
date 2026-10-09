"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface OpenWord {
  key: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  left: number;
  top: number;
  below: boolean;
}

// Half the popover's max width plus a margin, so it never leaves the screen
const EDGE = 112;
// Space kept clear for the bars at the top of the reader
const TOP_CLEARANCE = 160;

// Words are server-rendered with their meaning in data attributes; this island
// listens for taps on them, like WordHighlightManager does for audio.
export function WordMeaningPopover() {
  const [word, setWord] = useState<OpenWord | null>(null);

  useEffect(() => {
    const close = () => setWord(null);

    const onClick = (event: MouseEvent) => {
      const target =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>("[data-meaning]")
          : null;

      if (!target) {
        close();
        return;
      }

      const key = `${target.dataset.ayah}:${target.dataset.word}`;
      const rect = target.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const below = rect.top < TOP_CLEARANCE;

      setWord((current) =>
        current?.key === key
          ? null
          : {
              key,
              arabic: target.textContent ?? "",
              transliteration: target.dataset.translit ?? "",
              meaning: target.dataset.meaning ?? "",
              left: Math.min(Math.max(center, EDGE), window.innerWidth - EDGE) + window.scrollX,
              top: (below ? rect.bottom + 8 : rect.top - 8) + window.scrollY,
              below,
            },
      );
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    // A phone fires resize whenever its address bar slides, so only a change
    // in width, which reflows the words, closes the popover
    let width = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      close();
    };

    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  if (!word) return null;

  // Placed in page coordinates on the body, so it stays on its word while the
  // page scrolls instead of having to close
  return createPortal(
    <div
      role="status"
      style={{ left: word.left, top: word.top }}
      className={`glass pointer-events-none absolute z-50 flex w-max max-w-52 -translate-x-1/2 flex-col items-center gap-1 rounded-2xl border border-outline-variant/20 px-4 py-3 text-center shadow-2xl ${
        word.below ? "" : "-translate-y-full"
      }`}
    >
      <span dir="rtl" className="font-arabic text-[1.5rem] leading-normal text-on-surface">
        {word.arabic}
      </span>
      {word.transliteration && (
        <span className="text-label-sm text-primary/80">{word.transliteration}</span>
      )}
      <span className="text-body-sm text-on-surface">{word.meaning}</span>
    </div>,
    document.body,
  );
}
