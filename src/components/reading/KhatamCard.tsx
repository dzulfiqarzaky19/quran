"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AyahRef,
  KHATAM_TARGET_DAYS,
  TOTAL_AYAHS,
  ayahHref,
  ayahLabel,
  fromPosition,
  isKhatamComplete,
  khatamDailyTarget,
  khatamReadToday,
  toPosition,
} from "@/lib/reading";
import { useReadingStore } from "@/store/reading";

interface KhatamCardProps {
  surahNames: string[];
  lastRead: AyahRef | null;
  /** Local calendar day, YYYY-MM-DD */
  today: string;
}

const primaryButton =
  "flex h-12 cursor-pointer items-center justify-center rounded-xl bg-primary px-4 text-body-sm font-semibold text-surface transition-transform active:scale-[0.98]";
const secondaryButton =
  "flex h-12 cursor-pointer items-center justify-center rounded-xl bg-surface-container-high px-4 text-body-sm font-semibold text-on-surface transition-transform active:scale-[0.98]";

export function KhatamCard({ surahNames, lastRead, today }: KhatamCardProps) {
  const khatam = useReadingStore((state) => state.khatam);
  const startKhatam = useReadingStore((state) => state.startKhatam);
  const endKhatam = useReadingStore((state) => state.endKhatam);
  const [targetDays, setTargetDays] = useState<number>(KHATAM_TARGET_DAYS[0]);

  if (!khatam || isKhatamComplete(khatam)) {
    // Verses before the last-read one count as already done
    const resumePosition = lastRead ? toPosition(lastRead) - 1 : 0;

    return (
      <div className="rounded-2xl bg-surface-container-low p-6">
        <p className="text-body-lg text-on-surface">
          {khatam
            ? "Khatam complete. Alhamdulillah."
            : "Read the whole Quran in order, with a daily verse target."}
        </p>
        <label
          htmlFor="khatam-days"
          className="mb-2 mt-6 block text-label-sm uppercase tracking-[0.05em] text-on-surface-variant"
        >
          Finish in
        </label>
        <select
          id="khatam-days"
          value={targetDays}
          onChange={(event) => setTargetDays(Number(event.target.value))}
          className="h-12 w-full cursor-pointer rounded-xl border border-outline-variant/15 bg-surface-container-highest px-3 text-body-lg text-on-surface transition-colors focus:border-primary/40 focus:outline-none"
        >
          {KHATAM_TARGET_DAYS.map((days) => (
            <option key={days} value={days}>
              {days} days · {Math.ceil(TOTAL_AYAHS / days)} verses a day
            </option>
          ))}
        </select>
        <div className="mt-4 flex flex-col gap-2">
          <button type="button" onClick={() => startKhatam(targetDays, 0)} className={primaryButton}>
            Start from Al-Fatihah
          </button>
          {lastRead && resumePosition > 0 && (
            <button
              type="button"
              onClick={() => startKhatam(targetDays, resumePosition)}
              className={secondaryButton}
            >
              Start from {ayahLabel(surahNames, lastRead)}
            </button>
          )}
        </div>
      </div>
    );
  }

  const nextAyah = fromPosition(khatam.position + 1);
  const fraction = khatam.position / TOTAL_AYAHS;

  return (
    <div className="rounded-2xl bg-surface-container-low p-6">
      <p className="text-display-lg font-bold tabular-nums">
        {Math.floor(fraction * 100)}%
        <span className="ml-2 text-title-lg font-semibold text-on-surface-variant">
          {khatam.position} of {TOTAL_AYAHS}
        </span>
      </p>
      <div
        role="progressbar"
        aria-label="Khatam progress"
        aria-valuemin={0}
        aria-valuemax={TOTAL_AYAHS}
        aria-valuenow={khatam.position}
        className="mt-3 h-0.5 w-full bg-secondary-container"
      >
        <div className="h-full origin-left bg-primary" style={{ transform: `scaleX(${fraction})` }} />
      </div>
      <p className="mt-3 text-body-sm text-on-surface-variant">
        Today: {khatamReadToday(khatam, today)} of {khatamDailyTarget(khatam)} verses. Only verses
        read in order count.
      </p>
      <div className="mt-6 flex flex-col gap-2">
        <Link href={ayahHref(nextAyah)} className={primaryButton}>
          Continue at {ayahLabel(surahNames, nextAyah)}
        </Link>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("End this khatam? Its progress will be erased.")) endKhatam();
          }}
          className={secondaryButton}
        >
          End khatam
        </button>
      </div>
    </div>
  );
}
