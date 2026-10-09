import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  HIJRI_MONTHS,
  HijriDay,
  dayKey,
  formatGregorianDate,
  formatHijriDate,
  getHijriEvent,
} from '@/lib/hijri';

interface HijriMonthGridProps {
  days: HijriDay[];
  /** The current Hijri day, highlighted when it is in this month. */
  today: Date;
  /** Last Gregorian day that can be marked as fasted. */
  lastMarkable: Date;
  fasted: string[];
  onToggleFasted: (day: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  /** Present when another month is showing. */
  onReset?: () => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const navButton =
  'flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-on-surface-variant transition-transform hover:text-on-surface active:scale-[0.98]';

export const HijriMonthGrid = ({
  days,
  today,
  lastMarkable,
  fasted,
  onToggleFasted,
  onPrevious,
  onNext,
  onReset,
}: HijriMonthGridProps) => {
  const { year, month } = days[0].hijri;
  const first = days[0].date;
  const last = days[days.length - 1].date;
  const fastedCount = days.filter((day) => fasted.includes(dayKey(day.date))).length;
  const events = days.flatMap((day) => {
    const label = getHijriEvent(day.hijri);
    return label ? [{ ...day, label }] : [];
  });

  return (
    <section aria-labelledby="hijri-month-label">
      <div className="mb-3 flex items-center justify-between gap-2 pl-3">
        <div>
          <h2 id="hijri-month-label" className="text-title-lg font-bold tracking-tight">
            {HIJRI_MONTHS[month - 1]} {year}
          </h2>
          <p className="text-body-sm text-on-surface-variant">
            {formatGregorianDate(first, { day: 'numeric', month: 'short' })} –{' '}
            {formatGregorianDate(last, { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center">
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="h-11 cursor-pointer rounded-xl px-3 text-body-sm font-semibold text-primary active:scale-[0.98]"
            >
              Today
            </button>
          )}
          <button type="button" onClick={onPrevious} aria-label="Previous month" className={navButton}>
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" onClick={onNext} aria-label="Next month" className={navButton}>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((weekday) => (
          <span key={weekday} className="pb-1 text-label-sm text-on-surface-variant">
            {weekday}
          </span>
        ))}
        {days.map((day, index) => {
          const key = dayKey(day.date);
          const isFasted = fasted.includes(key);
          const isToday = day.date.getTime() === today.getTime();
          const event = getHijriEvent(day.hijri);
          const gregorian = formatGregorianDate(day.date, { day: 'numeric', month: 'long' });

          return (
            <button
              key={key}
              type="button"
              onClick={() => onToggleFasted(key)}
              disabled={day.date.getTime() > lastMarkable.getTime()}
              aria-pressed={isFasted}
              aria-current={isToday ? 'date' : undefined}
              aria-label={`${formatHijriDate(day.hijri)}, ${gregorian}${event ? `, ${event}` : ''}${isFasted ? ', fasted' : ''}`}
              style={index === 0 ? { gridColumnStart: first.getUTCDay() + 1 } : undefined}
              className={`relative flex h-14 cursor-pointer flex-col items-center justify-center rounded-xl transition-transform active:scale-[0.98] disabled:cursor-default disabled:active:scale-100 ${
                isFasted ? 'bg-primary-container' : isToday ? 'bg-surface-container-high' : ''
              }`}
            >
              <span
                className={`text-body-lg tabular-nums ${
                  isToday || isFasted ? 'font-semibold text-primary' : 'text-on-surface'
                }`}
              >
                {day.hijri.day}
              </span>
              <span className="text-label-sm tabular-nums text-on-surface-variant">
                {day.date.getUTCDate()}
              </span>
              {event && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />}
            </button>
          );
        })}
      </div>

      <p className="mt-4 px-3 text-body-sm text-on-surface-variant">
        {fastedCount} of {days.length} days fasted. Tap a day to mark it.
      </p>

      {events.length > 0 && (
        <ul className="mt-4 flex flex-col gap-1">
          {events.map((event) => (
            <li key={event.label} className="flex h-12 items-center justify-between px-3">
              <span className="text-body-lg text-on-surface">{event.label}</span>
              <span className="text-body-sm tabular-nums text-on-surface-variant">
                {event.hijri.day} {HIJRI_MONTHS[month - 1]} ·{' '}
                {formatGregorianDate(event.date, { day: 'numeric', month: 'short' })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
