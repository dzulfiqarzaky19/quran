export interface Surah {
  surahName: string;
  surahNameArabic: string;
  surahNameArabicLong: string;
  surahNameTranslation: string;
  revelationPlace: string;
  totalAyah: number;
}

export interface AudioEntry {
  reciter: string;
  url: string;
  originalUrl: string;
}

export interface SurahDetail extends Surah {
  surahNo: number;
  english: string[];
  arabic1: string[];
  arabic2: string[];
  bengali: string[];
  urdu: string[];
  audio: Record<string, AudioEntry>;
}

export interface TafsirEntry {
  author: string;
  groupVerse: string | null;
  content: string;
}

export interface TafsirResponse {
  surahName: string;
  surahNo: number;
  ayahNo: number;
  tafsirs: TafsirEntry[];
}

export interface IndonesianAyah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
}

export interface IndonesianSurahResponse {
  code: number;
  data: {
    number: number;
    ayahs: IndonesianAyah[];
  };
}
