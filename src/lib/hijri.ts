import { CalculationMethodId, PrayerLocation, calendarDayAt, getPrayerTimes } from './prayer';

export interface HijriDate {
  year: number;
  /** 1 (Muharram) to 12 (Dhu al-Hijjah). */
  month: number;
  day: number;
}

export interface HijriDay {
  hijri: HijriDate;
  /** UTC midnight of the Gregorian day whose daytime falls on this Hijri date. */
  date: Date;
}

export interface HijriToday extends HijriDay {
  /** The Hijri day starts at Maghrib, so after it `date` is already tomorrow. */
  afterMaghrib: boolean;
}

export interface FastingTimes {
  imsak: Date;
  fajr: Date;
  maghrib: Date;
}

export const HIJRI_MONTHS = [
  'Muharram',
  'Safar',
  "Rabi' al-Awwal",
  "Rabi' al-Thani",
  'Jumada al-Ula',
  'Jumada al-Akhirah',
  'Rajab',
  "Sha'ban",
  'Ramadan',
  'Shawwal',
  "Dhu al-Qi'dah",
  'Dhu al-Hijjah',
];

export const RAMADAN = 9;

/** Imsak is a precaution ahead of Fajr; 10 minutes is the Indonesian imsakiyah convention. */
export const IMSAK_MINUTES = 10;

export const HIJRI_ADJUSTMENTS = [-2, -1, 0, 1, 2];

const HIJRI_EVENTS: { month: number; day: number; label: string }[] = [
  { month: 1, day: 1, label: 'Islamic New Year' },
  { month: 1, day: 10, label: 'Ashura' },
  { month: 3, day: 12, label: 'Mawlid' },
  { month: 7, day: 27, label: "Isra Mi'raj" },
  { month: 8, day: 15, label: "Nisfu Sha'ban" },
  { month: 9, day: 1, label: 'Ramadan begins' },
  { month: 10, day: 1, label: 'Eid al-Fitr' },
  { month: 12, day: 9, label: 'Day of Arafah' },
  { month: 12, day: 10, label: 'Eid al-Adha' },
];

const DAY_MS = 86_400_000;

// Umm al-Qura is the tabular calendar shipped with every browser. Countries that
// sight the moon locally can land a day or two off it, hence the adjustment.
const umalqura = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
  timeZone: 'UTC',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
});

export const addDays = (date: Date, days: number): Date => new Date(date.getTime() + days * DAY_MS);

/** Key of a Gregorian day, as stored in the fasting log. */
export const dayKey = (date: Date): string => date.toISOString().slice(0, 10);

export function toHijri(date: Date, adjustment = 0): HijriDate {
  const parts = umalqura.formatToParts(addDays(date, adjustment));
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value);

  return { year: part('year'), month: part('month'), day: part('day') };
}

/** Every day of the Hijri month that `date` falls in. */
export function getHijriMonth(date: Date, adjustment = 0): HijriDay[] {
  const first = addDays(date, 1 - toHijri(date, adjustment).day);
  const { year, month } = toHijri(first, adjustment);
  const length = toHijri(addDays(first, 29), adjustment).day === 30 ? 30 : 29;

  return Array.from({ length }, (_, i) => ({
    hijri: { year, month, day: i + 1 },
    date: addDays(first, i),
  }));
}

/** The Hijri date at the location; without a location the day turns at midnight instead of Maghrib. */
export function getHijriToday(
  now: Date,
  location: PrayerLocation | null,
  method: CalculationMethodId,
  adjustment = 0,
): HijriToday {
  const civil = calendarDayAt(now, location?.timeZone);
  const maghrib = location
    ? getPrayerTimes(location, now, method).find((t) => t.id === 'maghrib')
    : undefined;
  const afterMaghrib = maghrib !== undefined && now.getTime() >= maghrib.time.getTime();
  const date = new Date(
    Date.UTC(civil.getFullYear(), civil.getMonth(), civil.getDate() + (afterMaghrib ? 1 : 0)),
  );

  return { hijri: toHijri(date, adjustment), date, afterMaghrib };
}

/** Days until 1 Ramadan; 0 during Ramadan. */
export function daysUntilRamadan(today: HijriDay, adjustment = 0): number {
  if (today.hijri.month === RAMADAN) return 0;

  let first = addDays(today.date, 1 - today.hijri.day);
  while (toHijri(first, adjustment).month !== RAMADAN) {
    first = addDays(first, getHijriMonth(first, adjustment).length);
  }

  return Math.round((first.getTime() - today.date.getTime()) / DAY_MS);
}

/** Imsak, Fajr and Maghrib for the fast of the current Hijri day. */
export function getFastingTimes(
  location: PrayerLocation,
  now: Date,
  method: CalculationMethodId,
  afterMaghrib: boolean,
): FastingTimes {
  const times = getPrayerTimes(location, now, method, afterMaghrib ? 1 : 0);
  const timeOf = (id: 'fajr' | 'maghrib') => times.find((t) => t.id === id)?.time ?? new Date(NaN);
  const fajr = timeOf('fajr');

  return {
    imsak: new Date(fajr.getTime() - IMSAK_MINUTES * 60_000),
    fajr,
    maghrib: timeOf('maghrib'),
  };
}

export const getHijriEvent = ({ month, day }: HijriDate): string | undefined =>
  HIJRI_EVENTS.find((event) => event.month === month && event.day === day)?.label;

export const formatHijriDate = ({ year, month, day }: HijriDate): string =>
  `${day} ${HIJRI_MONTHS[month - 1]} ${year}`;

export const formatGregorianDate = (date: Date, options: Intl.DateTimeFormatOptions): string =>
  new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', ...options }).format(date);
