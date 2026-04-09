import { Surah, SurahDetail, TafsirResponse, IndonesianSurahResponse, ChapterAudioResponse } from './types';

const PRIMARY_API = 'https://quranapi.pages.dev/api';
const SECONDARY_API = 'https://api.alquran.cloud/v1';

export async function fetchSurahList(): Promise<Surah[]> {
  const res = await fetch(`${PRIMARY_API}/surah.json`);
  if (!res.ok) throw new Error('Failed to fetch surah list');
  return res.json();
}

export async function fetchSurah(id: number): Promise<SurahDetail> {
  const res = await fetch(`${PRIMARY_API}/${id}.json`);
  if (!res.ok) throw new Error(`Failed to fetch surah ${id}`);
  return res.json();
}

export async function fetchTafsir(surahNo: number, ayahNo: number): Promise<TafsirResponse> {
  const res = await fetch(`${PRIMARY_API}/tafsir/${surahNo}_${ayahNo}.json`);
  if (!res.ok) throw new Error(`Failed to fetch tafsir for surah ${surahNo} ayah ${ayahNo}`);
  return res.json();
}

export async function fetchIndonesianTranslation(surahNo: number): Promise<string[]> {
  const res = await fetch(`${SECONDARY_API}/surah/${surahNo}/id.indonesian`);
  if (!res.ok) throw new Error(`Failed to fetch Indonesian translation for surah ${surahNo}`);
  const json: IndonesianSurahResponse = await res.json();
  return json.data.ayahs.map(ayah => ayah.text);
}

export async function fetchAudioSegments(surahNo: number, reciterId: number = 7): Promise<ChapterAudioResponse> {
  const res = await fetch(`https://api.quran.com/api/v4/chapter_recitations/${reciterId}/${surahNo}?segments=true`);
  if (!res.ok) throw new Error(`Failed to fetch audio segments for surah ${surahNo}`);
  return res.json();
}

export async function fetchSurahTajweed(surahNo: number): Promise<string[]> {
  const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNo}/quran-tajweed`);
  if (!res.ok) throw new Error(`Failed to fetch Tajweed data for surah ${surahNo}`);
  const json = await res.json();
  return json.data.ayahs.map((ayah: { text: string }) => ayah.text);
}
