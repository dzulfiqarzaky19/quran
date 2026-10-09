"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useNow } from '@/hooks/useNow';
import {
  HIJRI_ADJUSTMENTS,
  HIJRI_MONTHS,
  RAMADAN,
  addDays,
  daysUntilRamadan,
  formatGregorianDate,
  getFastingTimes,
  getHijriMonth,
  getHijriToday,
} from '@/lib/hijri';
import { DEFAULT_METHOD, isCalculationMethodId } from '@/lib/prayer';
import { useHijriStore } from '@/store/hijri';
import { usePrayerStore } from '@/store/prayer';
import { FastingTimes } from './FastingTimes';
import { HijriMonthGrid } from './HijriMonthGrid';

const adjustmentLabel = (adjustment: number): string => {
  if (adjustment === 0) return 'Umm al-Qura (no adjustment)';
  const days = `${Math.abs(adjustment)} day${Math.abs(adjustment) === 1 ? '' : 's'}`;
  return adjustment > 0 ? `${days} ahead` : `${days} behind`;
};

export function HijriView() {
  const now = useNow();
  const location = usePrayerStore((state) => state.location);
  const storedMethod = usePrayerStore((state) => state.method);
  const storedAdjustment = useHijriStore((state) => state.adjustment);
  const setAdjustment = useHijriStore((state) => state.setAdjustment);
  const fasted = useHijriStore((state) => state.fasted);
  const toggleFasted = useHijriStore((state) => state.toggleFasted);
  // A day in the month on screen; null follows the current month
  const [anchor, setAnchor] = useState<Date | null>(null);

  // The clock and the persisted settings only exist in the browser
  if (!now) {
    return (
      <div className="mx-auto flex w-full max-w-xl animate-pulse flex-col gap-10">
        <div className="mx-3 h-32 rounded-xl bg-surface-container-low" />
        <div className="h-80 rounded-xl bg-surface-container-low" />
      </div>
    );
  }

  const method = isCalculationMethodId(storedMethod) ? storedMethod : DEFAULT_METHOD;
  const adjustment = HIJRI_ADJUSTMENTS.includes(storedAdjustment) ? storedAdjustment : 0;
  const today = getHijriToday(now, location, method, adjustment);
  const civilToday = today.afterMaghrib ? addDays(today.date, -1) : today.date;
  const isRamadan = today.hijri.month === RAMADAN;
  const days = getHijriMonth(anchor ?? today.date, adjustment);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-10">
      <section aria-labelledby="hijri-today-label" className="px-3">
        <p
          id="hijri-today-label"
          className="text-label-sm uppercase tracking-[0.05em] text-on-surface-variant"
        >
          {today.afterMaghrib ? 'Since Maghrib' : 'Today'}
        </p>
        {/* Month names run long, so the year sits on the line below to keep the date on one line */}
        <h1 className="mt-2 text-[2rem] font-bold leading-tight tracking-tight sm:text-display-lg">
          {today.hijri.day} {HIJRI_MONTHS[today.hijri.month - 1]}
        </h1>
        <p className="mt-1 text-body-lg text-on-surface-variant">
          {today.hijri.year} AH ·{' '}
          {formatGregorianDate(civilToday, {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
        <p className="mt-1 text-title-lg font-semibold tabular-nums text-primary">
          {isRamadan
            ? `Ramadan day ${today.hijri.day}`
            : `Ramadan in ${daysUntilRamadan(today, adjustment)} days`}
        </p>
      </section>

      {location ? (
        <FastingTimes
          times={getFastingTimes(location, now, method, today.afterMaghrib)}
          now={now}
          isTomorrow={today.afterMaghrib}
          showCountdown={isRamadan}
          timeZone={location.timeZone}
        />
      ) : (
        <p className="px-3 text-body-lg text-on-surface-variant">
          Imsak and iftar times need your location, and the Hijri day will then turn at Maghrib.{' '}
          <Link href="/prayer" className="font-semibold text-primary">
            Set it on the Prayer page
          </Link>
          .
        </p>
      )}

      <HijriMonthGrid
        days={days}
        today={today.date}
        lastMarkable={civilToday}
        fasted={fasted}
        onToggleFasted={toggleFasted}
        onPrevious={() => setAnchor(addDays(days[0].date, -1))}
        onNext={() => setAnchor(addDays(days[days.length - 1].date, 1))}
        onReset={anchor ? () => setAnchor(null) : undefined}
      />

      <section aria-labelledby="hijri-settings-label" className="px-3">
        <h2 id="hijri-settings-label" className="sr-only">
          Calendar settings
        </h2>
        <label
          htmlFor="hijri-adjustment"
          className="mb-2 block text-label-sm uppercase tracking-[0.05em] text-on-surface-variant"
        >
          Date adjustment
        </label>
        <select
          id="hijri-adjustment"
          value={adjustment}
          onChange={(event) => setAdjustment(Number(event.target.value))}
          className="h-12 w-full cursor-pointer rounded-xl border border-outline-variant/15 bg-surface-container-highest px-3 text-body-lg text-on-surface transition-colors focus:border-primary/40 focus:outline-none"
        >
          {HIJRI_ADJUSTMENTS.map((value) => (
            <option key={value} value={value}>
              {adjustmentLabel(value)}
            </option>
          ))}
        </select>
        <p className="mt-2 text-body-sm text-on-surface-variant">
          Dates follow the Umm al-Qura calendar. If your country announced a month on a different
          day, shift the dates to match.
        </p>
      </section>
    </div>
  );
}
