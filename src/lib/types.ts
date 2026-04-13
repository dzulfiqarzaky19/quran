export interface Surah {
  surahNo: number;
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

export interface Chapter {
  id: number;
  revelation_place: string;
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  pages: [number, number];
  translated_name: {
    language_name: string;
    name: string;
  };
}

export interface VerseWord {
  id: number;
  position: number;
  audio_url: string | null;
  char_type_name: string;
  text: string;
  translation: {
    text: string;
    language_name: string;
  };
  transliteration: {
    text: string | null;
    language_name: string;
  };
}

export interface Verse {
  id: number;
  verse_number: number;
  verse_key: string;
  text_uthmani: string;
  page_number: number;
  juz_number: number;
  words?: VerseWord[];
  translations?: {
    id: number;
    resource_id: number;
    text: string;
  }[];
}

export interface VersesResponse {
  verses: Verse[];
  pagination: {
    per_page: number;
    current_page: number;
    next_page: number | null;
    total_pages: number;
    total_records: number;
  };
}

export type AudioSegment = [number, number, number];

export interface VerseTimestamp {
  verse_key: string;
  timestamp_from: number;
  timestamp_to: number;
  segments: AudioSegment[];
}

export interface ChapterAudioResponse {
  audio_file: {
    id: number;
    chapter_id: number;
    audio_url: string;
    timestamps: VerseTimestamp[];
  };
}

export interface RecitationResource {
  id: number;
  reciter_name: string;
  style: string | null;
  translated_name: {
    name: string;
    language_name: string;
  };
}

export interface TranslationResource {
  id: number;
  name: string;
  author_name: string;
  slug: string;
  language_name: string;
  translated_name: {
    name: string;
    language_name: string;
  };
}
