import { Surah, SurahDetail, TafsirResponse, ChapterAudioResponse, Chapter, VersesResponse } from './types';

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

export async function fetchVerses(
  surahNo: number,
  page: number = 1,
  perPage: number = 10
): Promise<VersesResponse> {

  const res = await fetch(
    `${PRIMARY_API}/verses/by_chapter/${surahNo}?language=en&words=true&translations=131,33&fields=text_uthmani&page=${page}&per_page=${perPage}`
  );
  if (!res.ok) throw new Error(`Failed to fetch verses for surah ${surahNo} page ${page}`);
  return res.json();
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

export async function fetchIndonesianTranslation(surahNo: number): Promise<string[]> {
  const res = await fetch(`${TAJWEED_API}/surah/${surahNo}/id.indonesian`);
  if (!res.ok) throw new Error(`Failed to fetch Indonesian translation for surah ${surahNo}`);
  const json = await res.json();
  return json.data.ayahs.map((ayah: { text: string }) => ayah.text);
}

export async function fetchAudioSegments(surahNo: number, reciterId: number = 7): Promise<ChapterAudioResponse> {
  const res = await fetch(`${PRIMARY_API}/chapter_recitations/${reciterId}/${surahNo}?segments=true`);
  if (!res.ok) throw new Error(`Failed to fetch audio segments for surah ${surahNo}`);
  return res.json();
}
