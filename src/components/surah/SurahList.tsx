import { Surah } from "@/lib/types";
import { SurahCard } from "./SurahCard";

interface SurahListProps {
  surahs: Surah[];
  searchQuery?: string;
}

export const SurahList = ({ surahs, searchQuery }: SurahListProps) => {
  if (surahs.length === 0) {
    return (
      <div className="py-20 text-center text-on-surface-variant h-full flex flex-col justify-center">
        <p>No Surahs found matching &quot;{searchQuery}&quot;</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {surahs.map((surah) => (
        <SurahCard key={surah.surahNo} surah={surah} />
      ))}
    </div>
  );
};
