import Link from "next/link";
import { Surah } from "@/lib/types";

interface SurahCardProps {
  surah: Surah;
}

export const SurahCard = ({ surah }: SurahCardProps) => (
  <Link
    href={`/surah/${surah.surahNo}`}
    className="flex min-h-16 items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-surface-container-low active:scale-[0.98] active:bg-surface-container-high"
  >
    <span className="w-8 shrink-0 text-label-sm font-medium tabular-nums tracking-[0.05em] text-primary">
      {surah.surahNo}
    </span>
    <span className="min-w-0 flex-1">
      <span className="block truncate text-body-lg font-semibold text-on-surface">
        {surah.surahName}
      </span>
      <span className="block truncate text-body-sm text-on-surface-variant">
        {surah.surahNameTranslation} · {surah.totalAyah} verses
      </span>
    </span>
    <span
      className="shrink-0 font-arabic text-title-lg text-on-surface"
      dir="rtl"
      lang="ar"
    >
      {surah.surahNameArabic}
    </span>
  </Link>
);
