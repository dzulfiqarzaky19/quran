import { VerseCard } from './VerseCard';

interface VerseListProps {
  surahNo: number;
  arabicVars: string[];
  englishVars: string[];
  indonesianVars: string[];
}

export function VerseList({ surahNo, arabicVars, englishVars, indonesianVars }: VerseListProps) {
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {arabicVars.map((arabic, idx) => (
        <VerseCard
          key={idx}
          surahNo={surahNo}
          ayahNo={idx + 1}
          arabic={arabic}
          english={englishVars[idx]}
          indonesian={indonesianVars[idx]}
        />
      ))}
    </div>
  );
}
