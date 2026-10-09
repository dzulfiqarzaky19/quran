"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { DzikirItem } from "@/lib/types";

interface DzikirCardProps {
  item: DzikirItem;
}

export const DzikirCard = ({ item }: DzikirCardProps) => {
  const [count, setCount] = useState(0);
  const done = count >= item.repeat;

  return (
    <li
      className={`flex flex-col gap-6 rounded-2xl bg-surface-container-low p-5 transition-opacity sm:p-6 ${done ? "opacity-50" : ""}`}
    >
      <p
        className="font-arabic text-[1.75rem] leading-[2.2] text-on-surface"
        dir="rtl"
        lang="ar"
      >
        {item.arabic}
      </p>

      <div className="flex flex-col gap-2">
        {item.transliteration && (
          <p className="text-body-sm text-primary/80">{item.transliteration}</p>
        )}
        {item.translation && (
          <p className="text-body-lg text-on-surface-variant">{item.translation}</p>
        )}
      </div>

      {/* Tapping a finished card starts it over */}
      <button
        type="button"
        onClick={() => setCount(done ? 0 : count + 1)}
        aria-label={done ? "Done. Tap to start over" : `Recited ${count} of ${item.repeat}. Tap to count`}
        className="flex h-12 items-center justify-center gap-2 self-stretch rounded-xl bg-surface-container-high text-body-sm font-semibold tabular-nums text-on-surface transition-colors hover:bg-surface-container-highest active:scale-[0.98]"
      >
        {done ? (
          <>
            <Check className="h-4 w-4 text-primary" aria-hidden="true" />
            Done
          </>
        ) : (
          <>
            {count} / {item.repeat}
          </>
        )}
      </button>
    </li>
  );
};
