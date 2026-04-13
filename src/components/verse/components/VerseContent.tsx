import { ArabicWord } from "./ArabicWord";
import { NumberFrame } from "../../ui/NumberFrame";
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
      <div className="text-right" dir="rtl">
        <div className="text-title-lg font-arabic text-on-surface leading-[2.6] flex flex-wrap justify-start gap-x-3 gap-y-2">
          {tajweedWords.map((wordObj, idx) => (
            <ArabicWord
              key={idx}
              ayahNo={ayahNo}
              wordId={wordObj.wordId}
              segments={wordObj.segments}
              isStopMark={wordObj.isStopMark}
            />
          ))}
          <NumberFrame ayahNo={ayahNo} className="mr-2" />
        </div>
      </div>

      <div className="space-y-4">
        {fullTransliteration && (
          <p className="text-body-lg text-primary/80 font-medium italic tracking-wide">
            {fullTransliteration}
          </p>
        )}
        <VerseTranslation initialText={translation} translationId={translationId} />
      </div>
    </div>
  );
};
