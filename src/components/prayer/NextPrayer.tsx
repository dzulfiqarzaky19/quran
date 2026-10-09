import { PrayerTime, formatCountdown, formatPrayerTime } from '@/lib/prayer';

interface NextPrayerProps {
  next: PrayerTime;
  now: Date;
  timeZone?: string;
}

export const NextPrayer = ({ next, now, timeZone }: NextPrayerProps) => (
  <section aria-labelledby="next-prayer-label" className="px-3">
    <p
      id="next-prayer-label"
      className="text-label-sm uppercase tracking-[0.05em] text-on-surface-variant"
    >
      Next prayer
    </p>
    <div className="mt-2 flex items-baseline justify-between gap-4">
      <h1 className="text-display-lg font-bold">{next.label}</h1>
      <p className="shrink-0 text-title-lg font-semibold tabular-nums text-on-surface-variant">
        {formatPrayerTime(next.time, timeZone)}
      </p>
    </div>
    <p
      role="timer"
      aria-label={`Time until ${next.label}`}
      className="mt-1 text-title-lg font-semibold tabular-nums text-primary"
    >
      {formatCountdown(next.time.getTime() - now.getTime())}
    </p>
  </section>
);
