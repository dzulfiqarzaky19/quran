"use client";

import { Settings2 } from "lucide-react";
import { useAppStore } from "@/store";

export function SettingsButton() {
  const setIsSettingsOpen = useAppStore((state) => state.setIsSettingsOpen);

  return (
    <button
      onClick={() => setIsSettingsOpen(true)}
      className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant cursor-pointer hover:bg-surface-container-high transition-colors border-none outline-none"
      aria-label="Open Settings"
    >
      <Settings2 className="w-5 h-5" />
    </button>
  );
}
