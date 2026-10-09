import index from '@/data/dzikir/index.json';
import { DzikirCategory, DzikirCategoryDetail, DzikirItem } from './types';

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
