import { VerseHeader } from "./components/VerseHeader";
import { VerseContent } from "./components/VerseContent";
import { VerseFooter } from "./components/VerseFooter";
import { VerseWord } from "@/lib/types";

interface VerseCardProps {
  surahNo: number;
  ayahNo: number;
  arabic: string;
  translation: string;
  translationId: number;
  tajweedData: string;
  words?: VerseWord[];
}

export const VerseCard = ({
  surahNo,
  ayahNo,
  arabic,
  translation,
  translationId,
  tajweedData,
  words,
}: VerseCardProps) => {
  return (
    <div
      id={`verse-${ayahNo}`}
      className="relative w-full rounded-3xl p-6 md:p-8 transition-all duration-300 bg-surface-container hover:bg-surface-container-high"
    >
      <VerseHeader surahNo={surahNo} ayahNo={ayahNo} />

      <VerseContent
        ayahNo={ayahNo}
        arabic={arabic}
        translation={translation}
        translationId={translationId}
        tajweedData={tajweedData}
        words={words}
      />

      <VerseFooter ayahNo={ayahNo} />
    </div>
  );
};
