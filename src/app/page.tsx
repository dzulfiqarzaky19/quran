import { fetchSurahList } from '@/lib/api';
import { SurahListClient } from '@/components/surah/SurahListClient';

export const revalidate = 86400; // Cache for 24 hours

export default async function Home() {
  const rawSurahs = await fetchSurahList();
  const surahs = rawSurahs.map((s, idx) => ({ ...s, surahNo: idx + 1 }));

  return (
    <div className="flex flex-col">
      <div className="mb-16 mt-8">
        <h1 className="text-display-lg font-bold text-center tracking-tight mb-4">
          The Sacred Lens
        </h1>
        <p className="text-center text-on-surface-variant text-body-lg max-w-2xl mx-auto">
          A high-precision editorial reading experience.
        </p>
      </div>
      
      <SurahListClient surahs={surahs} />
    </div>
  );
}
