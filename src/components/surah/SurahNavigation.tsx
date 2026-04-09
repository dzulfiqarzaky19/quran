import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface SurahNavigationProps {
  surahNo: number;
}

export const SurahNavigation = ({ surahNo }: SurahNavigationProps) => {
  const prevSurah = surahNo > 1 ? surahNo - 1 : null;
  const nextSurah = surahNo < 114 ? surahNo + 1 : null;

  return (
    <div className="mt-16 pt-8 border-t border-outline-variant/15 flex justify-between items-center pb-16">
      {prevSurah ? (
        <Link
          href={`/surah/${prevSurah}`}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface"
        >
          <ChevronLeft className="w-5 h-5 text-on-surface-variant shrink-0" />
          <span className="font-semibold text-body-lg text-on-surface-variant hidden sm:inline">
            Prev Surah
          </span>
          <span className="font-semibold text-body-lg text-on-surface-variant sm:hidden">
            Prev
          </span>
        </Link>
      ) : (
        <div />
      )}

      {nextSurah ? (
        <Link
          href={`/surah/${nextSurah}`}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-br from-primary to-primary-container text-white hover:scale-[0.98] transition-transform"
        >
          <span className="font-semibold text-body-lg hidden sm:inline">
            Next Surah
          </span>
          <span className="font-semibold text-body-lg sm:hidden">Next</span>
          <ChevronRight className="w-5 h-5 text-white/80 shrink-0" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
};

