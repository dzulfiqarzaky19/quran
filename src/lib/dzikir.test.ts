import { getDzikirCategories, getDzikirCategory, FEATURED_DZIKIR_IDS } from './dzikir';

describe('Dzikir snapshot', () => {
  it('lists every category with a title and a count', () => {
    const categories = getDzikirCategories();
    expect(categories).toHaveLength(132);
    for (const category of categories) {
      expect(category.title).not.toBe('');
      expect(category.count).toBeGreaterThan(0);
    }
  });

  it('resolves every featured category', async () => {
    for (const id of FEATURED_DZIKIR_IDS) {
      expect(await getDzikirCategory(id)).not.toBeNull();
    }
  });

  it('gives every item Arabic text and a repeat count', async () => {
    for (const { id, count } of getDzikirCategories()) {
      const category = await getDzikirCategory(id);
      expect(category?.items).toHaveLength(count);
      for (const item of category?.items ?? []) {
        expect(item.arabic).not.toBe('');
        expect(item.repeat).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('returns null for an unknown category', async () => {
    expect(await getDzikirCategory(9999)).toBeNull();
  });
});
