"use client";

import { useEffect, useSyncExternalStore } from "react";
import { RotateCcw } from "lucide-react";
import { TASBIH_TARGETS, TasbihTarget, useTasbihStore } from "@/store/tasbih";

const TARGET_OPTIONS: TasbihTarget[] = [...TASBIH_TARGETS, null];

export const TasbihCounter = () => {
  const { count, target, increment, reset, setTarget } = useTasbihStore();
  // The server snapshot keeps `persist` (absent without localStorage) out of the server render
  const hydrated = useSyncExternalStore(
    (onChange) => useTasbihStore.persist.onFinishHydration(onChange),
    () => useTasbihStore.persist.hasHydrated(),
    () => false
  );

  useEffect(() => {
    void useTasbihStore.persist.rehydrate();
  }, []);

  const handleTap = () => {
    increment();
    if (target && (count + 1) % target === 0 && "vibrate" in navigator) {
      navigator.vibrate(200);
    }
  };

  const reached = target !== null && count >= target;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-8">
      <h1 className="self-start px-3 text-title-lg font-bold tracking-tight">Tasbih</h1>

      <div role="radiogroup" aria-label="Target" className="flex gap-2">
        {TARGET_OPTIONS.map((option) => (
          <button
            key={option ?? "none"}
            type="button"
            role="radio"
            aria-checked={target === option}
            onClick={() => setTarget(option)}
            className={`h-11 min-w-14 rounded-xl px-3 text-body-sm font-semibold tabular-nums transition-colors active:scale-[0.98] ${
              target === option
                ? "bg-primary-container text-white"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            {option ?? "Free"}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={handleTap}
        disabled={!hydrated}
        aria-label={`Count is ${count}. Tap to add one`}
        className="flex aspect-square w-full max-w-xs touch-manipulation select-none flex-col items-center justify-center gap-2 rounded-full bg-surface-container-low transition-colors hover:bg-surface-container active:scale-[0.98] active:bg-surface-container-high"
      >
        <span className="text-display-lg font-bold tabular-nums text-on-surface">
          {hydrated ? count : " "}
        </span>
        <span className="text-label-sm uppercase tracking-[0.05em] text-on-surface-variant">
          {reached ? "Target reached" : target ? `of ${target}` : "Tap to count"}
        </span>
      </button>

      <button
        type="button"
        onClick={reset}
        className="flex h-11 items-center gap-2 rounded-xl px-4 text-body-sm font-semibold text-on-surface-variant transition-colors hover:text-primary active:scale-[0.98]"
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        Reset
      </button>
    </div>
  );
};
