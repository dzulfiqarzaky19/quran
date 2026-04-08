interface SurahHeaderProps {
  surahNo: number;
  surahName: string;
  surahNameArabic: string;
  surahNameTranslation: string;
  totalAyah: number;
  revelationPlace: string;
}

export function SurahHeader({ surahNo, surahName, surahNameArabic, surahNameTranslation, totalAyah, revelationPlace }: SurahHeaderProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 mb-8 text-center bg-surface-container-lowest rounded-3xl px-4">
      <div className="w-16 h-16 mb-8 flex items-center justify-center relative">
        <svg className="absolute inset-0 w-full h-full text-primary/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M12 2L2 12l10 10 10-10L12 2z" />
        </svg>
        <span className="text-body-lg tracking-widest text-primary z-10 font-bold">{surahNo}</span>
      </div>
      
      <h1 className="text-display-lg font-bold mb-4">{surahName}</h1>
      <h2 className="text-title-lg font-arabic text-on-surface mb-6">{surahNameArabic}</h2>
      
      <p className="text-body-lg text-on-surface-variant max-w-md mx-auto mb-6">
        {surahNameTranslation}
      </p>
      
      <div className="text-label-sm text-on-surface-variant tracking-[0.05em] uppercase px-6 py-2 bg-surface-container-low rounded-full">
        {revelationPlace} • {totalAyah} VERSES
      </div>
      
      {surahNo !== 1 && surahNo !== 9 && (
        <div className="mt-12 pt-12 border-t border-outline-variant/15 w-full max-w-md">
          <p className="text-display-lg font-arabic text-on-surface leading-normal pb-4" dir="rtl">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
        </div>
      )}
    </div>
  );
}
