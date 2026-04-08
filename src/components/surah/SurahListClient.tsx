'use client';

import { SurahCard, SurahWithNo } from './SurahCard';
import { useAppStore } from '@/store';
import { useMemo } from 'react';

interface SurahListClientProps {
  surahs: SurahWithNo[];
}

export function SurahListClient({ surahs }: SurahListClientProps) {
  const searchQuery = useAppStore((state) => state.searchQuery);

  const filtered = useMemo(() => {
    if (!searchQuery) return surahs;
    const lower = searchQuery.toLowerCase();
    return surahs.filter(s => 
      s.surahName.toLowerCase().includes(lower) || 
      s.surahNameTranslation.toLowerCase().includes(lower) ||
      s.surahNo.toString() === lower
    );
  }, [surahs, searchQuery]);

  if (filtered.length === 0) {
    return (
      <div className="py-20 text-center text-on-surface-variant h-full flex flex-col justify-center">
        <p>No Surahs found matching "{searchQuery}"</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {filtered.map((surah) => (
        <SurahCard key={surah.surahNo} surah={surah} />
      ))}
    </div>
  );
}
