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
}

export const VerseContent = ({
  ayahNo,
  arabic,
  translation,
  translationId,
  tajweedData,
  words,
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

  const fullTransliteration = words
    ?.filter((w) => w.char_type_name === "word")
    .map((w) => w.transliteration.text)
    .join(" ");

  return (
    <div className="flex flex-col gap-8">
      <div
        className="font-arabic text-[2rem] text-on-surface leading-[2.5]"
        dir="rtl"
      >
        {tajweedWords.map((wordObj, idx) => (
          <span key={idx}>
            <ArabicWord
              ayahNo={ayahNo}
              wordId={wordObj.wordId}
              segments={wordObj.segments}
              isStopMark={wordObj.isStopMark}
            />{" "}
          </span>
        ))}
      </div>

      <div>
        {fullTransliteration && (
          <p className="text-body-sm text-primary/80">
            {fullTransliteration}
          </p>
        )}
        <VerseTranslation initialText={translation} translationId={translationId} />
      </div>
    </div>
  );
};
