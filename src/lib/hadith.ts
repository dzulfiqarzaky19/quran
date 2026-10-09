import {
  Hadith,
  HadithCollection,
  HadithCollectionId,
  HadithSearchResult,
  HadithSection,
  HadithSectionDetail,
} from './types';

// Texts come from fawazahmed0/hadith-api at runtime. Nothing is stored in the repo.

const HADITH_API = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1';
const DAY_SECONDS = 86400;

export const HADITH_SOURCE = 'https://github.com/fawazahmed0/hadith-api';
export const HADITH_SEARCH_LIMIT = 50;

export const HADITH_COLLECTIONS: HadithCollection[] = [
  { id: 'bukhari', title: 'Sahih al-Bukhari', description: 'Compiled by Imam al-Bukhari' },
  { id: 'muslim', title: 'Sahih Muslim', description: 'Compiled by Imam Muslim' },
  { id: 'nawawi', title: 'Forty Hadith of an-Nawawi', description: 'Compiled by Imam an-Nawawi' },
];

type Json = Record<string, unknown>;

interface Edition {
  sections: HadithSection[];
  hadiths: Omit<Hadith, 'arabic'>[];
}

const isRecord = (value: unknown): value is Json =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

// The API README asks clients to fall back from the minified file to the plain one.
// A 404 means the file does not exist in either form.
async function fetchJson(path: string, init: RequestInit): Promise<Json | null> {
  for (const extension of ['.min.json', '.json']) {
    const res = await fetch(`${HADITH_API}/${path}${extension}`, init);
    if (res.status === 404) return null;
    if (!res.ok) continue;
    const data: unknown = await res.json();
    if (isRecord(data)) return data;
  }
  throw new Error(`Failed to fetch hadith data: ${path}`);
}

function parseHadiths(raw: unknown): Edition['hadiths'] {
  if (!Array.isArray(raw)) throw new Error('Hadith API returned no hadith list');
  return raw.flatMap((hadith) =>
    isRecord(hadith) && typeof hadith.hadithnumber === 'number' && typeof hadith.text === 'string'
      ? [{ number: hadith.hadithnumber, text: hadith.text.trim() }]
      : [],
  );
}

function parseSections(titles: unknown, ranges: unknown): HadithSection[] {
  if (!isRecord(titles) || !isRecord(ranges)) throw new Error('Hadith API returned no section list');
  return Object.entries(titles)
    .flatMap(([key, title]) => {
      const range = ranges[key];
      // Section 0 is an untitled placeholder in most collections
      if (typeof title !== 'string' || !title.trim() || !isRecord(range)) return [];
      const { hadithnumber_first: first, hadithnumber_last: last } = range;
      if (typeof first !== 'number' || typeof last !== 'number') return [];
      return [{ id: Number(key), title: title.trim(), first, last }];
    })
    .sort((a, b) => a.id - b.id);
}

// A whole English edition is several megabytes, so the parsed copy is kept in
// memory for a day instead of going through the fetch cache.
const editions = new Map<HadithCollectionId, { at: number; data: Promise<Edition> }>();

function loadEdition(id: HadithCollectionId): Promise<Edition> {
  const cached = editions.get(id);
  if (cached && Date.now() - cached.at < DAY_SECONDS * 1000) return cached.data;

  const data = fetchJson(`editions/eng-${id}`, { cache: 'no-store' }).then((json) => {
    if (!json || !isRecord(json.metadata)) throw new Error(`Hadith collection not found: ${id}`);
    return {
      sections: parseSections(json.metadata.sections, json.metadata.section_details),
      hadiths: parseHadiths(json.hadiths),
    };
  });
  editions.set(id, { at: Date.now(), data });
  // A failed download must not be served for a day
  data.catch(() => editions.delete(id));
  return data;
}

export function getHadithCollection(id: string): HadithCollection | null {
  return HADITH_COLLECTIONS.find((c) => c.id === id) ?? null;
}

export async function getHadithSections(id: HadithCollectionId): Promise<HadithSection[]> {
  return (await loadEdition(id)).sections;
}

export async function getHadithSection(
  id: HadithCollectionId,
  sectionId: number,
): Promise<HadithSectionDetail | null> {
  const init = { next: { revalidate: DAY_SECONDS } };
  const [english, arabic] = await Promise.all([
    fetchJson(`editions/eng-${id}/sections/${sectionId}`, init),
    fetchJson(`editions/ara-${id}/sections/${sectionId}`, init),
  ]);
  if (!english || !isRecord(english.metadata)) return null;

  const [section] = parseSections(english.metadata.section, english.metadata.section_detail);
  if (!section) return null;

  const arabicByNumber = new Map(
    (arabic ? parseHadiths(arabic.hadiths) : []).map((h) => [h.number, h.text]),
  );
  const hadiths = parseHadiths(english.hadiths)
    .map((h) => ({ ...h, arabic: arabicByNumber.get(h.number) ?? '' }))
    .filter((h) => h.text || h.arabic);

  return { ...section, hadiths };
}

// Matches the English text, or the hadith number when the query is one
export async function searchHadith(
  id: HadithCollectionId,
  query: string,
): Promise<{ results: HadithSearchResult[]; total: number }> {
  const { sections, hadiths } = await loadEdition(id);
  const lower = query.toLowerCase();
  const number = Number(query);

  const byNumber = hadiths.filter((h) => h.text && h.number === number);
  const byText = hadiths.filter(
    (h) => h.text && h.number !== number && h.text.toLowerCase().includes(lower),
  );
  const matches = [...byNumber, ...byText];

  const results = matches.slice(0, HADITH_SEARCH_LIMIT).map((h) => ({
    ...h,
    sectionId: sections.find((s) => h.number >= s.first && h.number <= s.last)?.id ?? null,
  }));
  return { results, total: matches.length };
}
