import Link from 'next/link';

interface SurahNavigationProps {
  surahNo: number;
}

export function SurahNavigation({ surahNo }: SurahNavigationProps) {
  const prevSurah = surahNo > 1 ? surahNo - 1 : null;
  const nextSurah = surahNo < 114 ? surahNo + 1 : null;

  return (
    <div className="mt-16 pt-8 border-t border-outline-variant/15 flex justify-between items-center pb-16">
      {prevSurah ? (
        <Link 
          href={`/surah/${prevSurah}`}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface"
        >
          <svg className="w-5 h-5 text-on-surface-variant flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-semibold text-body-lg text-on-surface-variant hidden sm:inline">Prev Surah</span>
          <span className="font-semibold text-body-lg text-on-surface-variant sm:hidden">Prev</span>
        </Link>
      ) : (
        <div />
      )}

      {nextSurah ? (
        <Link 
          href={`/surah/${nextSurah}`}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white hover:scale-[0.98] transition-transform"
        >
          <span className="font-semibold text-body-lg hidden sm:inline">Next Surah</span>
          <span className="font-semibold text-body-lg sm:hidden">Next</span>
          <svg className="w-5 h-5 text-white/80 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
