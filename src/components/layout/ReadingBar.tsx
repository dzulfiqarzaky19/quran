import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Surah } from "@/lib/types";
import { SettingsButton } from "./SettingsButton";
import { ReadingProgress } from "./ReadingProgress";

interface ReadingBarProps {
  surah: Surah;
}

export const ReadingBar = ({ surah }: ReadingBarProps) => (
  <nav className="glass fixed inset-x-0 top-0 z-40">
    <div className="mx-auto flex h-12 max-w-3xl items-center gap-1 px-1">
      <Link
        href="/"
        aria-label="All surahs"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-on-surface-variant transition-colors hover:text-primary active:scale-[0.98]"
      >
        <ChevronLeft className="h-5 w-5" />
      </Link>
      <p className="min-w-0 flex-1 truncate text-body-sm font-semibold text-on-surface">
        {surah.surahNo}. {surah.surahName}
        <span className="ml-2 font-normal text-on-surface-variant">
          {surah.totalAyah} verses
        </span>
      </p>
      <SettingsButton />
    </div>
    <ReadingProgress />
  </nav>
);
