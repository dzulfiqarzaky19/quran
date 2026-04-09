import { memo } from "react";
import { toArabicNumber } from "@/utils/number";

interface NumberFrameProps {
  ayahNo: number;
  className?: string;
}

export const NumberFrame = memo(function NumberFrame({
  ayahNo,
  className = "",
}: NumberFrameProps) {
  const arabicAyahNo = toArabicNumber(ayahNo);

  return (
    <div
      className={`relative inline-flex items-center justify-center w-10 h-10 shrink-0 mx-1 select-none ${className}`}
      style={{ verticalAlign: "middle" }}
    >
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full text-primary/80"
      >
        <path
          d="M18 2.5L21.5 6L25.5 5L27.5 8.5L31.5 9L31 13L34 16L32.5 20L34 24L31 27L31.5 31L27.5 31.5L25.5 35L21.5 34L18 37.5L14.5 34L10.5 35L8.5 31.5L4.5 31L5 27L2 24L3.5 20L2 16L5 13L4.5 9L8.5 8.5L10.5 5L14.5 6L18 2.5Z"
          fill="currentColor"
          fillOpacity="0.1"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="18"
          cy="20"
          r="10"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="2 2"
        />
      </svg>
      <span className="relative z-10 font-bold text-[10px] text-primary mt-1">
        {arabicAyahNo}
      </span>
    </div>
  );
});
