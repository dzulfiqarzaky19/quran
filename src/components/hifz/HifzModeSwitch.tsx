"use client";

import { useHifzStore } from "@/store/hifz";

interface HifzModeSwitchProps {
  className?: string;
}

export const HifzModeSwitch = ({ className = "" }: HifzModeSwitchProps) => {
  const hideVerses = useHifzStore((state) => state.hideVerses);
  const setHideVerses = useHifzStore((state) => state.setHideVerses);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={hideVerses}
      onClick={() => setHideVerses(!hideVerses)}
      className={`flex items-center justify-between gap-4 text-left transition-colors hover:bg-surface-container-high ${className}`}
    >
      <span>
        <span className="block text-body-md font-bold">Hifz mode</span>
        <span className="block text-body-sm text-on-surface-variant">
          Hide each verse until you tap it
        </span>
      </span>
      <span
        className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${
          hideVerses ? "bg-primary" : "bg-surface-container-highest"
        }`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-white transition-transform ${
            hideVerses ? "translate-x-5" : ""
          }`}
        />
      </span>
    </button>
  );
};
