import Link from 'next/link';
import { Surah } from '@/lib/types';

export interface SurahWithNo extends Surah {
  surahNo: number;
}

interface SurahCardProps {
  surah: SurahWithNo;
}

export function SurahCard({ surah }: SurahCardProps) {
  return (
    <Link href={`/surah/${surah.surahNo}`} className="block group">
      <div className="bg-surface-container-low hover:bg-surface-container-high transition-all duration-300 transform group-active:scale-[0.98] rounded-2xl p-6 md:p-8 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start mb-8">
          <div className="w-10 h-10 flex items-center justify-center relative shrink-0">
            <svg className="absolute inset-0 w-full h-full text-primary/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M12 2L2 12l10 10 10-10L12 2z" />
            </svg>
            <span className="text-label-sm tracking-widest text-primary z-10 font-medium">{surah.surahNo}</span>
          </div>
          <h2 className="text-title-lg font-arabic text-on-surface text-right pr-2" dir="rtl">
            {surah.surahNameArabic}
          </h2>
        </div>
        
        <div>
          <h3 className="text-body-lg font-semibold text-on-surface mb-1">{surah.surahName}</h3>
          <p className="text-body-sm text-on-surface-variant mb-4 line-clamp-1">{surah.surahNameTranslation}</p>
          <div className="text-label-sm text-on-surface-variant tracking-[0.05em] uppercase">
            {surah.revelationPlace} • {surah.totalAyah} VERSES
          </div>
        </div>
      </div>
    </Link>
  );
}
