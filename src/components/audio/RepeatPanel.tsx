"use client";

import { useState } from "react";
import { REPEAT_COUNTS, RepeatRange, startRepeat } from "@/lib/hifz";

interface RepeatPanelProps {
  totalAyah: number;
  /** Ayah the range starts from when none is running */
  defaultAyah: number;
  repeat: RepeatRange | null;
  onStart: (repeat: RepeatRange) => void;
  onStop: () => void;
}

const field =
  "h-11 w-full rounded-xl bg-surface-container-high px-3 text-body-md font-semibold tabular-nums text-on-surface";
const fieldLabel = "flex min-w-0 flex-1 flex-col gap-1 text-label-sm text-on-surface-variant";

export function RepeatPanel({ totalAyah, defaultAyah, repeat, onStart, onStop }: RepeatPanelProps) {
  const [from, setFrom] = useState(String(repeat?.from ?? defaultAyah));
  const [to, setTo] = useState(String(repeat?.to ?? defaultAyah));
  const [times, setTimes] = useState<number>(repeat?.times ?? REPEAT_COUNTS[0]);

  return (
    <form
      aria-label="Repeat a range"
      onSubmit={(e) => {
        e.preventDefault();
        onStart(startRepeat(Number(from), Number(to), times, totalAyah));
      }}
      className="mx-auto flex max-w-3xl flex-col gap-3 px-3 pb-3 pt-4"
    >
      <div className="flex gap-2">
        <label className={fieldLabel}>
          From ayah
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={totalAyah}
            required
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className={field}
          />
        </label>
        <label className={fieldLabel}>
          To ayah
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={totalAyah}
            required
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className={field}
          />
        </label>
      </div>

      <div role="group" aria-label="Times" className="flex gap-2">
        {REPEAT_COUNTS.map((count) => (
          <button
            key={count}
            type="button"
            onClick={() => setTimes(count)}
            aria-pressed={times === count}
            aria-label={Number.isFinite(count) ? `${count} times` : "Until stopped"}
            className={`h-11 flex-1 rounded-xl text-body-sm font-bold transition-colors active:scale-[0.98] ${
              times === count
                ? "bg-primary text-surface"
                : "bg-surface-container-high text-on-surface-variant hover:text-primary"
            }`}
          >
            {Number.isFinite(count) ? `${count}×` : "∞"}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        {repeat && (
          <button
            type="button"
            onClick={onStop}
            className="h-11 flex-1 rounded-xl bg-surface-container-high text-body-sm font-bold text-on-surface transition-colors hover:text-primary active:scale-[0.98]"
          >
            Stop repeating
          </button>
        )}
        <button
          type="submit"
          className="h-11 flex-1 rounded-xl bg-primary text-body-sm font-bold text-surface transition-transform active:scale-[0.98]"
        >
          {repeat ? "Restart" : "Repeat range"}
        </button>
      </div>
    </form>
  );
}
