import { ArabicWord } from "./ArabicWord";
import { getTajweedWords } from "@/utils/tajweed";
import { VerseWord } from "@/lib/types";
import { VerseTranslation } from "./VerseTranslation";

interface VerseContentProps {
  ayahNo: number;
  arabic: string;
  translation: string;
  translationId: number;
  tajweedData: string;
  words?: VerseWord[];
  wordByWord?: boolean;
}

export const VerseContent = ({
  ayahNo,
  arabic,
  translation,
  translationId,
  tajweedData,
  words,
  wordByWord = false,
}: VerseContentProps) => {
  const displayText = tajweedData || arabic;
  const rawWords = getTajweedWords(displayText);

  let counter = 0;
  const tajweedWords = rawWords.map((word) => {
    if (!word.isStopMark) counter++;
    return {
      ...word,
      wordId: word.isStopMark ? null : counter,
    };
  });

  const glossWords = words?.filter((w) => w.char_type_name === "word") ?? [];
  const fullTransliteration = glossWords.map((w) => w.transliteration.text).join(" ");

  // The Arabic comes from the tajweed source and the meanings from another, so
  // they are only paired when both split the ayah into the same number of words
  const showGloss = wordByWord && glossWords.length > 0 && glossWords.length === counter;

  return (
    <div className="flex flex-col gap-8">
      <div
        className={`font-arabic text-[2rem] text-on-surface ${showGloss ? "leading-[1.9]" : "leading-[2.5]"}`}
        dir="rtl"
      >
        {tajweedWords.map((wordObj, idx) => {
          const gloss = showGloss && wordObj.wordId !== null ? glossWords[wordObj.wordId - 1] : null;
          const arabicWord = (
            <ArabicWord
              ayahNo={ayahNo}
              wordId={wordObj.wordId}
              segments={wordObj.segments}
              isStopMark={wordObj.isStopMark}
            />
          );

          return gloss ? (
            <span key={idx} className="mb-4 inline-flex flex-col items-center px-1 align-top">
              {arabicWord}
              <span dir="ltr" className="font-sans text-label-sm text-primary/80">
                {gloss.transliteration.text}
              </span>
              <span dir="ltr" className="max-w-28 font-sans text-label-sm text-on-surface-variant">
                {gloss.translation.text}
              </span>
            </span>
          ) : (
            <span key={idx}>{arabicWord} </span>
          );
        })}
      </div>

      <div>
        {fullTransliteration && !showGloss && (
          <p className="text-body-sm text-primary/80">
            {fullTransliteration}
          </p>
        )}
        <VerseTranslation initialText={translation} translationId={translationId} />
      </div>
    </div>
  );
};
