import index from '@/data/dzikir/index.json';
import { DailyDzikir, DzikirCategory, DzikirCategoryDetail, DzikirGroup, DzikirItem } from './types';
import { dayNumber } from './reading';

// Reads the snapshot written by scripts/fetch-dzikir.mjs. No network at runtime.

export const DZIKIR_SOURCE = index.source;

// Morning and evening, after prayer, before sleeping, waking up
export const FEATURED_DZIKIR_IDS = [27, 25, 28, 1];

export function getDzikirCategories(): DzikirCategory[] {
  return index.categories;
}

export async function getDzikirCategory(id: number): Promise<DzikirCategoryDetail | null> {
  const category = index.categories.find((c) => c.id === id);
  if (!category) return null;
  const items: DzikirItem[] = (await import(`@/data/dzikir/${category.id}.json`)).default;
  return { ...category, items };
}

// Everyday life in the order of a day
export const EVERYDAY_DZIKIR: { title: string; ids: number[] }[] = [
  { title: 'Morning', ids: [1, 2, 6, 7, 8, 9, 27] },
  { title: 'Home', ids: [10, 11] },
  { title: 'Prayer', ids: [15, 12, 13, 14, 25] },
  { title: 'Food', ids: [69, 70] },
  { title: 'Out and about', ids: [95, 98, 77, 82] },
  { title: 'Night', ids: [28] },
];

// Longer topics are linked from the everyday page instead of listed on it
export const EVERYDAY_INLINE_LIMIT = 4;

// The dua of the day has to fit a card on the home page
const DAILY_MAX_ARABIC_LENGTH = 150;

export async function getEverydayDzikir(): Promise<DzikirGroup[]> {
  return Promise.all(
    EVERYDAY_DZIKIR.map(async ({ title, ids }) => ({
      title,
      topics: (await Promise.all(ids.map(getDzikirCategory))).flatMap((topic) => topic ?? []),
    })),
  );
}

/**
 * One short everyday dua per day, keyed by day number. The server only knows the UTC day,
 * and a reader's local day is at most one away from it, so both neighbours come along.
 */
export async function getDailyDzikir(now: Date): Promise<{ day: number; byDay: Record<number, DailyDzikir> }> {
  const pool = (await getEverydayDzikir()).flatMap(({ topics }) =>
    topics.flatMap(({ items, ...category }) =>
      items
        // Entries without a transliteration are instructions, not duas to recite
        .filter(
          (item) =>
            item.transliteration && item.translation && item.arabic.length <= DAILY_MAX_ARABIC_LENGTH,
        )
        .map((item) => ({ item, category })),
    ),
  );
  const day = dayNumber(now);
  const byDay = Object.fromEntries(
    [day - 1, day, day + 1].map((d) => [d, pool[d % pool.length]]),
  );
  return { day, byDay };
}
