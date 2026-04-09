"use client";

import { memo } from "react";
import { TajweedSegment } from "@/utils/tajweed";

interface ArabicWordProps {
  segments: TajweedSegment[];
  isHighlighted: boolean;
  isStopMark: boolean;
}

export const ArabicWord = memo(function ArabicWord({
  segments,
  isHighlighted,
  isStopMark,
}: ArabicWordProps) {
  return (
    <span
      className={`transition-all duration-200 rounded-md px-1 ${
        isHighlighted
          ? "bg-primary text-surface scale-110 shadow-lg shadow-primary/20"
          : isStopMark
          ? "text-on-surface-variant/60 text-[0.8em]"
          : ""
      }`}
    >
      {segments.map((segment, sIdx) => (
        <span
          key={sIdx}
          style={{ 
            color: !isHighlighted && segment.rule ? segment.rule.color : undefined,
            fontWeight: segment.rule ? "600" : "inherit"
          }}
          title={segment.rule?.description}
        >
          {segment.text}
        </span>
      ))}
    </span>
  );
});
