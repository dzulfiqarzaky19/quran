"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useNow } from "@/hooks/useNow";
import { dayNumber } from "@/lib/reading";
import { DailyDzikir } from "@/lib/types";

interface DzikirOfTheDayProps {
  // The server's UTC day, shown until the reader's own clock is known
  day: number;
  byDay: Record<number, DailyDzikir>;
}

export const DzikirOfTheDay = ({ day, byDay }: DzikirOfTheDayProps) => {
  const now = useNow();
  const localDay = now ? dayNumber(now, now.getTimezoneOffset()) : day;
  const { item, category } = byDay[localDay] ?? byDay[day];

  return (
    <section aria-label="Dua of the day" className="mb-6 flex flex-col gap-1">
      <Link
        href={`/dzikir/${category.id}`}
        className="flex flex-col gap-4 rounded-2xl bg-surface-container-low p-5 transition-colors hover:bg-surface-container active:scale-[0.99] active:bg-surface-container-high sm:p-6"
      >
        <span className="flex flex-col">
          <span className="text-label-sm uppercase tracking-[0.05em] text-primary">Dua of the day</span>
          <span className="text-body-sm text-on-surface-variant first-letter:uppercase">{category.title}</span>
        </span>
        <span className="block font-arabic text-[1.75rem] leading-[2.2] text-on-surface" dir="rtl" lang="ar">
          {item.arabic}
        </span>
        <span className="block text-body-lg text-on-surface-variant">{item.translation}</span>
      </Link>
      <Link
        href="/dzikir/daily"
        className="flex min-h-11 items-center justify-between gap-3 rounded-xl px-3 text-body-sm font-semibold text-on-surface-variant transition-colors hover:text-on-surface active:scale-[0.98]"
      >
        <span className="truncate">Everyday duas</span>
        <ChevronRight className="h-5 w-5 shrink-0" aria-hidden="true" />
      </Link>
    </section>
  );
};
