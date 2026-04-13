import { Surah, SurahDetail, TafsirResponse, ChapterAudioResponse, Chapter, VersesResponse, RecitationResource, TranslationResource } from './types';

const PRIMARY_API = 'https://api.quran.com/api/v4';
const TAFSEER_API = 'https://quranapi.pages.dev/api';
const TAJWEED_API = 'https://api.alquran.cloud/v1';

export async function fetchSurahList(): Promise<Surah[]> {
  const res = await fetch(`${PRIMARY_API}/chapters?language=en`);
  if (!res.ok) throw new Error('Failed to fetch surah list');
  const json = await res.json();
  return json.chapters.map((c: Chapter) => ({
    surahName: c.name_simple,
    surahNameArabic: c.name_arabic,
    surahNameArabicLong: c.name_arabic,
    surahNameTranslation: c.translated_name.name,
    revelationPlace: c.revelation_place,
    totalAyah: c.verses_count,
    surahNo: c.id,
  }));
}

export async function fetchSurah(id: number): Promise<SurahDetail> {
  const res = await fetch(`${PRIMARY_API}/chapters/${id}?language=en`);
  if (!res.ok) throw new Error(`Failed to fetch surah ${id}`);
  const json = await res.json();
  const c: Chapter = json.chapter;
  return {
    surahName: c.name_simple,
    surahNameArabic: c.name_arabic,
    surahNameArabicLong: c.name_arabic,
    surahNameTranslation: c.translated_name.name,
    revelationPlace: c.revelation_place,
    totalAyah: c.verses_count,
    surahNo: c.id,
    english: [],
    arabic1: [],
    arabic2: [],
    bengali: [],
    urdu: [],
    audio: {},
  };
}

const VERSES_PER_PAGE = 50;

export async function fetchArabicContent(
  surahNo: number,
  totalVerses: number = 286
): Promise<VersesResponse> {
  const pages = Math.ceil(totalVerses / VERSES_PER_PAGE);
  const pageRequests = Array.from({ length: pages }, (_, i) => {
    const page = i + 1;
    return fetch(
      `${PRIMARY_API}/verses/by_chapter/${surahNo}?language=en&words=true&word_fields=text_uthmani,transliteration&fields=text_uthmani&page=${page}&per_page=${VERSES_PER_PAGE}`,
      { next: { revalidate: 86400 } }
    ).then(res => {
      if (!res.ok) throw new Error(`Failed to fetch Arabic page ${page} for surah ${surahNo}`);
      return res.json();
    });
  });

  const responses = await Promise.all(pageRequests);
  
  // Merge all verses from all pages
  const allVerses = responses.flatMap(r => r.verses);
  
  return {
    ...responses[0],
    verses: allVerses,
    pagination: {
      ...responses[0].pagination,
      per_page: totalVerses,
      total_records: allVerses.length
    }
  };
}

export async function fetchTranslationContent(
  surahNo: number,
  translationId: number = 33,
  totalVerses: number = 286
): Promise<VersesResponse> {
  const pages = Math.ceil(totalVerses / VERSES_PER_PAGE);
  const pageRequests = Array.from({ length: pages }, (_, i) => {
    const page = i + 1;
    return fetch(
      `${PRIMARY_API}/verses/by_chapter/${surahNo}?language=en&translations=131,${translationId}&page=${page}&per_page=${VERSES_PER_PAGE}`,
      { next: { revalidate: 86400 } }
    ).then(res => {
      if (!res.ok) throw new Error(`Failed to fetch Translation page ${page} for surah ${surahNo}`);
      return res.json();
    });
  });

  const responses = await Promise.all(pageRequests);
  const allVerses = responses.flatMap(r => r.verses);

  return {
    ...responses[0],
    verses: allVerses,
    pagination: {
      ...responses[0].pagination,
      per_page: totalVerses,
      total_records: allVerses.length
    }
  };
}

export async function fetchTafsir(surahNo: number, ayahNo: number): Promise<TafsirResponse> {
  const res = await fetch(`${TAFSEER_API}/tafsir/${surahNo}_${ayahNo}.json`);
  if (!res.ok) throw new Error(`Failed to fetch tafsir for surah ${surahNo} ayah ${ayahNo}`);
  return res.json();
}

export async function fetchSurahTajweed(surahNo: number): Promise<string[]> {
  const res = await fetch(`${TAJWEED_API}/surah/${surahNo}/quran-tajweed`);
  if (!res.ok) throw new Error(`Failed to fetch Tajweed data for surah ${surahNo}`);
  const json = await res.json();
  return json.data.ayahs.map((ayah: { text: string }) => ayah.text);
}



export async function fetchAudioSegments(surahNo: number, reciterId: number = 7): Promise<ChapterAudioResponse> {
  const res = await fetch(`${PRIMARY_API}/chapter_recitations/${reciterId}/${surahNo}?segments=true`);
  if (!res.ok) throw new Error(`Failed to fetch audio segments for surah ${surahNo}`);
  return res.json();
}

export async function fetchRecitations(): Promise<RecitationResource[]> {
  const res = await fetch(`${PRIMARY_API}/resources/recitations?language=en`);
  if (!res.ok) throw new Error('Failed to fetch recitations');
  const json = await res.json();
  return json.recitations;
}

export async function fetchTranslations(): Promise<TranslationResource[]> {
  const res = await fetch(`${PRIMARY_API}/resources/translations?language=en`);
  if (!res.ok) throw new Error('Failed to fetch translations');
  const json = await res.json();
  return json.translations;
}
