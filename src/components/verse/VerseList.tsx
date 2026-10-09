import { fetchArabicContent, fetchTranslationContent, fetchSurahTajweed } from "@/lib/api";
import { VerseCard } from "./VerseCard";
import { WordHighlightManager } from "./WordHighlightManager";
import { ReadingTracker } from "@/components/reading/ReadingTracker";

interface VerseListProps {
  surahNo: number;
  totalVerses: number;
  translationId: number;
  wordByWord?: boolean;
}

export async function VerseList({
  surahNo,
  totalVerses,
  translationId,
  wordByWord = false,
}: VerseListProps) {
  const [arabicData, translationData, tajweedData] = await Promise.all([
    fetchArabicContent(surahNo, totalVerses),
    fetchTranslationContent(surahNo, translationId, totalVerses),
    fetchSurahTajweed(surahNo),
  ]);

  return (
    <div className="w-full flex flex-col">
      {/* Client island for DOM-based highlighting sync */}
      <WordHighlightManager />
      <ReadingTracker surahNo={surahNo} />

      {arabicData.verses.map((verse, index) => {
        const translation =
          translationData.verses[index]?.translations?.find(
            (t) => t.resource_id === translationId
          )?.text || "";

        return (
          <VerseCard
            key={verse.id}
            surahNo={surahNo}
            ayahNo={verse.verse_number}
            totalAyah={totalVerses}
            arabic={verse.text_uthmani}
            translation={translation}
            translationId={translationId}
            tajweedData={
              tajweedData ? tajweedData[verse.verse_number - 1] : ""
            }
            words={verse.words || []}
            wordByWord={wordByWord}
          />
        );
      })}
    </div>
  );
}
