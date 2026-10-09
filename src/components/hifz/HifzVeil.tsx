"use client";

import { ReactNode, useState } from "react";
import { useHydrated } from "@/hooks/useHydrated";
import { useHifzStore } from "@/store/hifz";

interface HifzVeilProps {
  children: ReactNode;
}

const textButton =
  "flex h-11 items-center rounded-xl px-3 text-label-sm font-black uppercase tracking-widest text-primary transition-colors hover:bg-primary/5 active:scale-[0.98]";

// In hifz mode the verse keeps its space but stays hidden until tapped, so
// revealing it does not move the page.
export const HifzVeil = ({ children }: HifzVeilProps) => {
  const hydrated = useHydrated();
  const hideVerses = useHifzStore((state) => state.hideVerses);
  const [revealed, setRevealed] = useState(false);

  const active = hydrated && hideVerses;
  const veiled = active && !revealed;

  return (
    <div className="relative">
      <div className={veiled ? "invisible" : undefined}>{children}</div>

      {active && (
        <button
          type="button"
          onClick={() => setRevealed(false)}
          className={`${textButton} mx-auto mt-4 ${veiled ? "invisible" : ""}`}
        >
          Hide again
        </button>
      )}

      {veiled && (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="absolute inset-0 flex w-full cursor-pointer items-center justify-center rounded-2xl bg-surface-container-low text-label-sm font-black uppercase tracking-widest text-primary transition-colors hover:bg-surface-container active:scale-[0.98]"
        >
          Tap to reveal
        </button>
      )}
    </div>
  );
};
