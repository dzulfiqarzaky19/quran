import {
  fetchSurah,
  fetchIndonesianTranslation,
  fetchSurahTajweed,
} from "@/lib/api";
import { VerseCard } from "./VerseCard";

interface VerseListProps {
  surahNo: number;
}

export async function VerseList({ surahNo }: VerseListProps) {
  const [surahData, indonesianVars, tajweedData] = await Promise.all([
    fetchSurah(surahNo),
    fetchIndonesianTranslation(surahNo),
    fetchSurahTajweed(surahNo),
  ]);

  const { arabic1: arabicVars, english: englishVars } = surahData;

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {arabicVars.map((arabic, idx) => (
        <VerseCard
          key={idx}
          surahNo={surahNo}
          ayahNo={idx + 1}
          arabic={arabic}
          english={englishVars[idx]}
          indonesian={indonesianVars[idx]}
          tajweedData={tajweedData[idx]}
        />
      ))}
    </div>
  );
}
