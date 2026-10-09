import { Surah } from "@/lib/types";
import { SurahCard } from "./SurahCard";

interface SurahListProps {
  surahs: Surah[];
  searchQuery?: string;
}

export const SurahList = ({ surahs, searchQuery }: SurahListProps) => {
  if (surahs.length === 0) {
    return (
      <p className="px-3 py-20 text-body-lg text-on-surface-variant">
        No surah matches &quot;{searchQuery}&quot;. Try a name or a number from 1 to 114.
      </p>
    );
  }

  return (
    <ol className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-x-8">
      {surahs.map((surah) => (
        <li key={surah.surahNo} className="min-w-0">
          <SurahCard surah={surah} />
        </li>
      ))}
    </ol>
  );
};
