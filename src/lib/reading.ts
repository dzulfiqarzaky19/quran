export interface AyahRef {
  surahNo: number;
  ayahNo: number;
}

/** Verses per surah, index 0 = Al-Fatihah. */
export const AYAH_COUNTS: readonly number[] = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
  112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85,
  54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13,
  14, 11, 11, 18, 12, 12, 30, 52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42,
  29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11,
  11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6,
];

export const TOTAL_AYAHS = AYAH_COUNTS.reduce((sum, count) => sum + count, 0);

/** Where a verse sits in the whole Quran: 1 for 1:1, TOTAL_AYAHS for 114:6. */
export function toPosition({ surahNo, ayahNo }: AyahRef): number {
  let position = ayahNo;
  for (let i = 0; i < surahNo - 1; i++) position += AYAH_COUNTS[i];
  return position;
}

export function fromPosition(position: number): AyahRef {
  let remaining = Math.min(Math.max(position, 1), TOTAL_AYAHS);
  let index = 0;
  while (remaining > AYAH_COUNTS[index]) {
    remaining -= AYAH_COUNTS[index];
    index++;
  }
  return { surahNo: index + 1, ayahNo: remaining };
}

export const ayahHref = ({ surahNo, ayahNo }: AyahRef): string =>
  `/surah/${surahNo}#verse-${ayahNo}`;

export const KHATAM_TARGET_DAYS = [30, 60, 90, 180, 365] as const;

export interface Khatam {
  /** Verses finished so far, counted in order from 1:1. */
  position: number;
  startPosition: number;
  targetDays: number;
  /** Local calendar day (YYYY-MM-DD) that `dayStart` belongs to. */
  day: string;
  /** `position` when the first verse of `day` was read. */
  dayStart: number;
}

// A khatam is read in order: a verse counts only if it is the next one, with a
// little slack for short verses passed faster than the reader registers them.
const KHATAM_SLACK = 3;

export function advanceKhatam(khatam: Khatam, ref: AyahRef, today: string): Khatam {
  const position = toPosition(ref);
  if (position <= khatam.position || position > khatam.position + KHATAM_SLACK) return khatam;

  return khatam.day === today
    ? { ...khatam, position }
    : { ...khatam, position, day: today, dayStart: khatam.position };
}

export const khatamDailyTarget = (khatam: Khatam): number =>
  Math.ceil((TOTAL_AYAHS - khatam.startPosition) / khatam.targetDays);

export const khatamReadToday = (khatam: Khatam, today: string): number =>
  khatam.day === today ? khatam.position - khatam.dayStart : 0;

export const isKhatamComplete = (khatam: Khatam): boolean => khatam.position >= TOTAL_AYAHS;

export function localDay(date: Date): string {
  const pad = (value: number) => value.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** `surahNames` is the full list in order, index 0 = Al-Fatihah. */
export const ayahLabel = (surahNames: string[], { surahNo, ayahNo }: AyahRef): string =>
  `${surahNames[surahNo - 1] ?? `Surah ${surahNo}`} · verse ${ayahNo}`;
