import { TajweedSegment } from "@/utils/tajweed";

interface ArabicWordProps {
  segments: TajweedSegment[];
  isStopMark: boolean;
  ayahNo: number;
  wordId: number | null;
}

export const ArabicWord = ({
  segments,
  isStopMark,
  ayahNo,
  wordId,
}: ArabicWordProps) => (
  <span
    data-ayah={ayahNo}
    data-word={wordId}
    className={`transition-all duration-200 rounded-md px-1 ${
      isStopMark ? "text-on-surface-variant/60 text-[0.8em]" : ""
    }`}
  >
    {segments.map((segment, sIdx) => (
      <span
        key={sIdx}
        style={{
          color: segment.rule ? segment.rule.color : undefined,
          fontWeight: segment.rule ? "600" : "inherit",
        }}
        title={segment.rule?.description}
      >
        {segment.text}
      </span>
    ))}
  </span>
);
