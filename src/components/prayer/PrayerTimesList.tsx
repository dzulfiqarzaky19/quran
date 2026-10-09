import { PrayerSchedule, formatPrayerTime } from '@/lib/prayer';

interface PrayerTimesListProps {
  schedule: PrayerSchedule;
  timeZone?: string;
}

export const PrayerTimesList = ({ schedule, timeZone }: PrayerTimesListProps) => {
  // Once Isha has passed, next is tomorrow's Fajr and nothing in today's list is upcoming
  const nextTime = schedule.next.time.getTime();

  return (
    <section aria-labelledby="prayer-times-label">
      <h2
        id="prayer-times-label"
        className="mb-3 px-3 text-label-sm uppercase tracking-[0.05em] text-on-surface-variant"
      >
        Today
      </h2>
      <ol className="flex flex-col gap-1">
        {schedule.times.map((prayer) => {
          const isNext = prayer.time.getTime() === nextTime;

          return (
            <li
              key={prayer.id}
              aria-current={isNext ? 'true' : undefined}
              className={`flex h-14 items-center justify-between rounded-xl px-3 ${
                isNext ? 'bg-surface-container-high' : ''
              }`}
            >
              <span
                className={`text-body-lg ${
                  isNext
                    ? 'font-semibold text-primary'
                    : prayer.id === 'sunrise'
                      ? 'text-on-surface-variant'
                      : 'text-on-surface'
                }`}
              >
                {prayer.label}
              </span>
              <span
                className={`text-body-lg tabular-nums ${
                  isNext ? 'font-semibold text-primary' : 'text-on-surface-variant'
                }`}
              >
                {formatPrayerTime(prayer.time, timeZone)}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
};
