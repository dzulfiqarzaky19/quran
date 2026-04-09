import { memo, useMemo } from "react";
import { ArabicWord } from "./ArabicWord";
import { NumberFrame } from "../../ui/NumberFrame";
import { getTajweedWords } from "@/utils/tajweed";
import { useAppStore } from "@/store";
import { useShallow } from "zustand/shallow";

interface VerseContentProps {
  ayahNo: number;
  arabic: string;
  english: string;
  indonesian: string;
  tajweedData: string;
}

export const VerseContent = memo(function VerseContent({
  ayahNo,
  arabic,
  english,
  indonesian,
  tajweedData,
}: VerseContentProps) {
  const { isPlayingAyah, activeAudioWord } = useAppStore(
    useShallow((state) => {
      const isThisAyah = state.activeAudioAyah === ayahNo;

      return {
        isPlayingAyah: isThisAyah,
        activeAudioWord: isThisAyah ? state.activeAudioWord : null,
        tajweedData: state.tajweedData,
      };
    }),
  );

  const tajweedWords = useMemo(() => {
    const displayText = tajweedData || arabic;
    const words = getTajweedWords(displayText);

    let counter = 0;
    return words.map((word) => {
      if (!word.isStopMark) counter++;
      return {
        ...word,
        wordId: word.isStopMark ? null : counter,
      };
    });
  }, [tajweedData, arabic]);

  return (
    <div className="flex flex-col gap-8">
      <div className="text-right" dir="rtl">
        <div className="text-title-lg font-arabic text-on-surface leading-[2.6] flex flex-wrap justify-start gap-x-3 gap-y-2">
          {tajweedWords.map((wordObj, idx) => (
            <ArabicWord
              key={idx}
              segments={wordObj.segments}
              isStopMark={wordObj.isStopMark}
              isHighlighted={
                !wordObj.isStopMark &&
                isPlayingAyah &&
                activeAudioWord === wordObj.wordId
              }
            />
          ))}
          <NumberFrame ayahNo={ayahNo} className="mr-2" />
        </div>
      </div>

      <div className="space-y-4">
        <p
          className={`text-body-lg transition-colors ${
            isPlayingAyah ? "text-primary font-medium" : "text-on-surface"
          }`}
        >
          {english}
        </p>
        <p className="text-body-lg text-on-surface-variant italic leading-relaxed">
          {indonesian}
        </p>
      </div>
    </div>
  );
});
