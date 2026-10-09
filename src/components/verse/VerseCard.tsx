import { VerseHeader } from "./components/VerseHeader";
import { VerseContent } from "./components/VerseContent";
import { VerseFooter } from "./components/VerseFooter";
import { VerseWord } from "@/lib/types";
import { HifzVeil } from "@/components/hifz/HifzVeil";

interface VerseCardProps {
  surahNo: number;
  ayahNo: number;
  totalAyah: number;
  arabic: string;
  translation: string;
  translationId: number;
  tajweedData: string;
  words?: VerseWord[];
  wordByWord?: boolean;
}

// One ayah fills the screen; the page snaps from ayah to ayah.
export const VerseCard = ({
  surahNo,
  ayahNo,
  totalAyah,
  arabic,
  translation,
  translationId,
  tajweedData,
  words,
  wordByWord = false,
}: VerseCardProps) => {
  return (
    <section
      id={`verse-${ayahNo}`}
      className="flex min-h-[100svh] w-full snap-start flex-col justify-center gap-8 rounded-3xl px-3 py-24 text-center"
    >
      <VerseHeader ayahNo={ayahNo} totalAyah={totalAyah} />

      <HifzVeil>
        <VerseContent
          ayahNo={ayahNo}
          arabic={arabic}
          translation={translation}
          translationId={translationId}
          tajweedData={tajweedData}
          words={words}
          wordByWord={wordByWord}
        />
      </HifzVeil>

      <VerseFooter
        surahNo={surahNo}
        ayahNo={ayahNo}
        arabic={arabic}
        translation={translation}
      />
    </section>
  );
};
