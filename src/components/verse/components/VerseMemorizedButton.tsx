"use client";

import { CircleCheck } from "lucide-react";
import { useHydrated } from "@/hooks/useHydrated";
import { isMemorized } from "@/lib/hifz";
import { useHifzStore } from "@/store/hifz";

interface VerseMemorizedButtonProps {
  surahNo: number;
  ayahNo: number;
}

// Only part of the reader in hifz mode
export const VerseMemorizedButton = ({ surahNo, ayahNo }: VerseMemorizedButtonProps) => {
  const hydrated = useHydrated();
  const hideVerses = useHifzStore((state) => state.hideVerses);
  const memorized = useHifzStore((state) => isMemorized(state.memorized, { surahNo, ayahNo }));
  const toggleMemorized = useHifzStore((state) => state.toggleMemorized);

  if (!hydrated || !hideVerses) return null;

  return (
    <button
      type="button"
      onClick={() => toggleMemorized({ surahNo, ayahNo })}
      aria-pressed={memorized}
      aria-label="Memorized"
      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors active:scale-[0.98] ${
        memorized
          ? "bg-primary text-surface"
          : "text-on-surface-variant hover:bg-surface-container-highest hover:text-primary"
      }`}
    >
      <CircleCheck className="w-5 h-5" />
    </button>
  );
};
