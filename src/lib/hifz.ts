import { AYAH_COUNTS, AyahRef } from './reading';

/** Memorized verse numbers per surah, keyed by surah number, each list ascending. */
export type Memorized = Record<number, number[]>;

export const isMemorized = (memorized: Memorized, { surahNo, ayahNo }: AyahRef): boolean =>
  memorized[surahNo]?.includes(ayahNo) ?? false;

export function toggleMemorized(memorized: Memorized, { surahNo, ayahNo }: AyahRef): Memorized {
  const ayahs = memorized[surahNo] ?? [];
  const next = ayahs.includes(ayahNo)
    ? ayahs.filter((ayah) => ayah !== ayahNo)
    : [...ayahs, ayahNo].sort((a, b) => a - b);

  const rest = { ...memorized };
  delete rest[surahNo];
  return next.length > 0 ? { ...rest, [surahNo]: next } : rest;
}

export const memorizedTotal = (memorized: Memorized): number =>
  Object.values(memorized).reduce((sum, ayahs) => sum + ayahs.length, 0);

export interface SurahProgress {
  surahNo: number;
  memorized: number;
  total: number;
  /** First verse not yet memorized, null once the surah is complete. */
  next: AyahRef | null;
}

/** Surahs with at least one memorized verse, in mushaf order. */
export function surahProgress(memorized: Memorized): SurahProgress[] {
  return Object.entries(memorized)
    .map(([key, ayahs]) => {
      const surahNo = Number(key);
      const total = AYAH_COUNTS[surahNo - 1];
      let ayahNo = 1;
      while (ayahs.includes(ayahNo)) ayahNo++;

      return {
        surahNo,
        memorized: ayahs.length,
        total,
        next: ayahNo <= total ? { surahNo, ayahNo } : null,
      };
    })
    .sort((a, b) => a.surahNo - b.surahNo);
}

/** Infinity repeats until stopped. */
export const REPEAT_COUNTS = [3, 5, 10, Infinity] as const;

export interface RepeatRange {
  from: number;
  to: number;
  times: number;
  /** Passes still to play, counting the one in progress. */
  remaining: number;
}

/** Orders the two ends and keeps them inside the surah. */
export function startRepeat(a: number, b: number, times: number, totalAyah: number): RepeatRange {
  const clamp = (ayah: number) => Math.min(Math.max(Math.trunc(ayah) || 1, 1), totalAyah);
  const from = Math.min(clamp(a), clamp(b));
  const to = Math.max(clamp(a), clamp(b));
  return { from, to, times, remaining: times };
}

/** The range after one pass has finished, null when it was the last. */
export const nextRepeat = (repeat: RepeatRange): RepeatRange | null =>
  repeat.remaining > 1 ? { ...repeat, remaining: repeat.remaining - 1 } : null;
