import { FastingTimes as Times, IMSAK_MINUTES } from '@/lib/hijri';
import { formatCountdown, formatPrayerTime } from '@/lib/prayer';

interface FastingTimesProps {
  times: Times;
  now: Date;
  /** The fast these times belong to is tomorrow's, because Maghrib has passed. */
  isTomorrow: boolean;
  /** Ramadan mode: count down to the start of the fast, then to iftar. */
  showCountdown: boolean;
  timeZone?: string;
}

export const FastingTimes = ({ times, now, isTomorrow, showCountdown, timeZone }: FastingTimesProps) => {
  const beforeFast = now.getTime() < times.fajr.getTime();
  const target = beforeFast
    ? { label: 'Fast begins in', time: times.fajr }
    : { label: 'Iftar in', time: times.maghrib };
  const rows = [
    { label: 'Imsak', note: `${IMSAK_MINUTES} min before Fajr`, time: times.imsak },
    { label: 'Fajr', note: 'Fast begins', time: times.fajr },
    { label: 'Maghrib', note: 'Iftar', time: times.maghrib },
  ];

  return (
    <section aria-labelledby="fasting-times-label">
      <h2
        id="fasting-times-label"
        className="mb-3 px-3 text-label-sm uppercase tracking-[0.05em] text-on-surface-variant"
      >
        Fasting times · {isTomorrow ? 'Tomorrow' : 'Today'}
      </h2>
      {showCountdown && (
        <div className="mb-3 flex items-baseline justify-between gap-4 rounded-xl bg-surface-container-high px-3 py-4">
          <span className="text-body-lg font-semibold text-on-surface">{target.label}</span>
          <span
            role="timer"
            aria-label={target.label}
            className="text-title-lg font-semibold tabular-nums text-primary"
          >
            {formatCountdown(target.time.getTime() - now.getTime())}
          </span>
        </div>
      )}
      <ol className="flex flex-col gap-1">
        {rows.map(({ label, note, time }) => (
          <li key={label} className="flex h-14 items-center justify-between rounded-xl px-3">
            <span className="text-body-lg text-on-surface">
              {label}
              <span className="ml-2 text-body-sm text-on-surface-variant">{note}</span>
            </span>
            <span className="text-body-lg tabular-nums text-on-surface-variant">
              {formatPrayerTime(time, timeZone)}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
};
