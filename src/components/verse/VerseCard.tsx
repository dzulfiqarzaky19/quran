'use client';
import { useAppStore } from '@/store';

interface VerseCardProps {
  surahNo: number;
  ayahNo: number;
  arabic: string;
  english: string;
  indonesian: string;
}

export function VerseCard({ surahNo, ayahNo, arabic, english, indonesian }: VerseCardProps) {
  const { activeVerse, setActiveVerse, openTafsir } = useAppStore();
  const isActive = activeVerse === ayahNo;

  return (
    <div 
      className={`relative w-full rounded-2xl p-6 md:p-8 transition-colors duration-300 ${isActive ? 'bg-surface-container-highest shadow-[inset_3px_0_0_0_var(--color-primary)]' : 'bg-surface-container hover:bg-surface-container-high'}`}
      onClick={() => setActiveVerse(ayahNo)}
    >
      <div className="flex flex-col md:flex-row-reverse gap-6 mb-8">
        <div className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant shrink-0 self-end md:self-start">
          <span className="text-label-sm">{ayahNo}</span>
        </div>
        <p className="text-title-lg font-arabic text-on-surface leading-[2.5] text-right flex-1" dir="rtl">
          {arabic}
        </p>
      </div>

      <div className="md:pr-16">
        <p className="text-body-lg text-on-surface mb-3">{english}</p>
        <p className="text-body-sm text-on-surface-variant italic mb-8">{indonesian}</p>
        
        <div className="flex flex-wrap gap-6 border-t border-outline-variant/15 pt-4">
          <button 
            onClick={(e) => { e.stopPropagation(); openTafsir(surahNo, ayahNo); }}
            className="text-label-sm font-bold tracking-[0.05em] text-primary hover:text-primary-container transition-colors uppercase"
          >
            Tafsir
          </button>
          <button className="text-label-sm font-bold tracking-[0.05em] text-on-surface-variant hover:text-on-surface transition-colors uppercase">
            Pelajaran
          </button>
          <button className="text-label-sm font-bold tracking-[0.05em] text-on-surface-variant hover:text-on-surface transition-colors uppercase">
            Refleksi
          </button>
        </div>
      </div>
    </div>
  );
}
