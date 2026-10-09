import {
  CalculationMethod,
  CalculationParameters,
  Coordinates,
  PrayerTimes,
  Qibla,
} from 'adhan';

export type PrayerId = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerLocation {
  label: string;
  latitude: number;
  longitude: number;
  /** IANA zone of the place. Omitted for the device's own position, which uses the device zone. */
  timeZone?: string;
}

export interface PrayerTime {
  id: PrayerId;
  label: string;
  time: Date;
}

export interface PrayerSchedule {
  /** Today's six times at the location, in order. */
  times: PrayerTime[];
  /** The next of the five prayers; tomorrow's Fajr once Isha has passed. */
  next: PrayerTime;
}

const PRAYER_LABELS: Record<PrayerId, string> = {
  fajr: 'Fajr',
  sunrise: 'Sunrise',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

const PRAYER_ORDER: PrayerId[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

// Kemenag publishes no adhan preset. Fajr 20 / Isha 18 (the Singapore preset, which
// also rounds up) plus 2 minutes of ihtiyat reproduced 17 of 18 times in the Kemenag
// schedule for Jakarta (2026-06-21, 2026-10-09) and Makassar (2026-10-09); the miss
// was one minute. The sunrise offset is fitted to those same three days.
const kemenag = (): CalculationParameters => {
  const params = CalculationMethod.Singapore();
  params.adjustments = { fajr: 2, sunrise: -4, dhuhr: 2, asr: 2, maghrib: 2, isha: 2 };
  return params;
};

export const CALCULATION_METHODS = {
  kemenag: { label: 'Kemenag (Indonesia)', params: kemenag },
  singapore: { label: 'MUIS (Singapore)', params: CalculationMethod.Singapore },
  muslimWorldLeague: { label: 'Muslim World League', params: CalculationMethod.MuslimWorldLeague },
  ummAlQura: { label: 'Umm al-Qura (Makkah)', params: CalculationMethod.UmmAlQura },
  egyptian: { label: 'Egyptian General Authority', params: CalculationMethod.Egyptian },
  karachi: { label: 'University of Karachi', params: CalculationMethod.Karachi },
  northAmerica: { label: 'ISNA (North America)', params: CalculationMethod.NorthAmerica },
} satisfies Record<string, { label: string; params: () => CalculationParameters }>;

export type CalculationMethodId = keyof typeof CALCULATION_METHODS;

export const DEFAULT_METHOD: CalculationMethodId = 'kemenag';

export const isCalculationMethodId = (value: string): value is CalculationMethodId =>
  value in CALCULATION_METHODS;

/** Manual fallback when the device position is unavailable or declined. */
export const CITIES: PrayerLocation[] = [
  { label: 'Jakarta', latitude: -6.1754, longitude: 106.8272, timeZone: 'Asia/Jakarta' },
  { label: 'Surabaya', latitude: -7.2575, longitude: 112.7521, timeZone: 'Asia/Jakarta' },
  { label: 'Bandung', latitude: -6.9175, longitude: 107.6191, timeZone: 'Asia/Jakarta' },
  { label: 'Semarang', latitude: -6.9932, longitude: 110.4203, timeZone: 'Asia/Jakarta' },
  { label: 'Yogyakarta', latitude: -7.7956, longitude: 110.3695, timeZone: 'Asia/Jakarta' },
  { label: 'Medan', latitude: 3.5952, longitude: 98.6722, timeZone: 'Asia/Jakarta' },
  { label: 'Palembang', latitude: -2.9761, longitude: 104.7754, timeZone: 'Asia/Jakarta' },
  { label: 'Banda Aceh', latitude: 5.5483, longitude: 95.3238, timeZone: 'Asia/Jakarta' },
  { label: 'Pontianak', latitude: -0.0263, longitude: 109.3425, timeZone: 'Asia/Pontianak' },
  { label: 'Balikpapan', latitude: -1.2379, longitude: 116.8529, timeZone: 'Asia/Makassar' },
  { label: 'Makassar', latitude: -5.1477, longitude: 119.4327, timeZone: 'Asia/Makassar' },
  { label: 'Denpasar', latitude: -8.6705, longitude: 115.2126, timeZone: 'Asia/Makassar' },
  { label: 'Jayapura', latitude: -2.5916, longitude: 140.669, timeZone: 'Asia/Jayapura' },
  { label: 'Kuala Lumpur', latitude: 3.139, longitude: 101.6869, timeZone: 'Asia/Kuala_Lumpur' },
  { label: 'Singapore', latitude: 1.3521, longitude: 103.8198, timeZone: 'Asia/Singapore' },
  { label: 'Makkah', latitude: 21.4225, longitude: 39.8262, timeZone: 'Asia/Riyadh' },
];

// adhan reads the calendar day from the Date's local fields, so the day has to be
// the one currently showing at the location, not on the device.
export const calendarDayAt = (now: Date, timeZone: string | undefined, offsetDays = 0): Date => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value);

  return new Date(part('year'), part('month') - 1, part('day') + offsetDays);
};

/** The six times of the day showing at the location, or of a day `offsetDays` from it. */
export function getPrayerTimes(
  location: PrayerLocation,
  now: Date,
  method: CalculationMethodId,
  offsetDays = 0,
): PrayerTime[] {
  const prayerTimes = new PrayerTimes(
    new Coordinates(location.latitude, location.longitude),
    calendarDayAt(now, location.timeZone, offsetDays),
    CALCULATION_METHODS[method].params(),
  );

  return PRAYER_ORDER.map((id) => ({ id, label: PRAYER_LABELS[id], time: prayerTimes[id] }));
}

export function getPrayerSchedule(
  location: PrayerLocation,
  now: Date,
  method: CalculationMethodId,
): PrayerSchedule {
  const times = getPrayerTimes(location, now, method);
  const upcoming = times.find((t) => t.id !== 'sunrise' && t.time.getTime() > now.getTime());
  const next = upcoming ?? getPrayerTimes(location, now, method, 1)[0];

  return { times, next };
}

/** Direction of the Kaaba in degrees clockwise from true north. */
export const getQiblaBearing = (location: PrayerLocation): number =>
  Qibla(new Coordinates(location.latitude, location.longitude));

const COMPASS_POINTS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

export const compassPoint = (degrees: number): string =>
  COMPASS_POINTS[Math.round((((degrees % 360) + 360) % 360) / 45) % 8];

export function formatPrayerTime(time: Date, timeZone?: string): string {
  // Polar days have no valid time for some prayers
  if (Number.isNaN(time.getTime())) return '--:--';

  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(time);
}

export function formatCountdown(milliseconds: number): string {
  if (Number.isNaN(milliseconds)) return '--:--:--';

  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const pad = (value: number) => value.toString().padStart(2, '0');

  return `${pad(Math.floor(totalSeconds / 3600))}:${pad(Math.floor((totalSeconds % 3600) / 60))}:${pad(totalSeconds % 60)}`;
}
