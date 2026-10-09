"use client";

import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { useNow } from "@/hooks/useNow";
import {
  ayahHref,
  ayahLabel,
  isKhatamComplete,
  khatamDailyTarget,
  khatamReadToday,
  localDay,
} from "@/lib/reading";
import { useReadingStore } from "@/store/reading";

interface ReadingResumeProps {
  surahNames: string[];
}

export function ReadingResume({ surahNames }: ReadingResumeProps) {
  const now = useNow();
  const lastRead = useReadingStore((state) => state.lastRead);
  const khatam = useReadingStore((state) => state.khatam);

  const khatamSummary =
    khatam && now
      ? isKhatamComplete(khatam)
        ? "Khatam complete"
        : `Khatam · ${khatamReadToday(khatam, localDay(now))} of ${khatamDailyTarget(khatam)} verses today`
      : "Bookmarks and khatam";

  return (
    <section aria-label="Your reading" className="mb-6 flex flex-col gap-1">
      {lastRead && (
        <Link
          href={ayahHref(lastRead)}
          className="flex min-h-16 items-center gap-3 rounded-xl bg-surface-container-low px-3 py-2 transition-colors hover:bg-surface-container active:scale-[0.98] active:bg-surface-container-high"
        >
          <BookOpen className="h-5 w-8 shrink-0 text-primary" aria-hidden="true" />
          <span className="min-w-0 flex-1">
            <span className="block text-label-sm uppercase tracking-[0.05em] text-on-surface-variant">
              Continue reading
            </span>
            <span className="block truncate text-body-lg font-semibold text-on-surface">
              {ayahLabel(surahNames, lastRead)}
            </span>
          </span>
          <ChevronRight className="h-5 w-5 shrink-0 text-on-surface-variant" aria-hidden="true" />
        </Link>
      )}
      <Link
        href="/reading"
        className="flex min-h-11 items-center justify-between gap-3 rounded-xl px-3 text-body-sm font-semibold text-on-surface-variant transition-colors hover:text-on-surface active:scale-[0.98]"
      >
        <span className="truncate">{khatamSummary}</span>
        <ChevronRight className="h-5 w-5 shrink-0" aria-hidden="true" />
      </Link>
    </section>
  );
}
