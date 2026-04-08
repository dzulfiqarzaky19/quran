import { fetchTafsir } from "@/lib/api";
import { TafsirModalContent } from "./TafsirModalContent/TafsirModalContent";

interface TafsirFetcherProps {
  surah: number;
  ayah: number;
  arabic: string;
  translation: string;
}

export const TafsirFetcher = async ({
  surah,
  ayah,
  arabic,
  translation,
}: TafsirFetcherProps) => {
  const data = await fetchTafsir(surah, ayah).catch((err) => {
    console.error("Failed to fetch tafsir:", err);
    return null;
  });

  if (!data || data.tafsirs.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-on-surface-variant text-body-lg gap-4">
        <svg
          className="w-12 h-12 opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477-4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        Tafsir data not found for this verse.
      </div>
    );
  }

  return (
    <TafsirModalContent
      data={data}
      surah={surah}
      ayah={ayah}
      arabic={arabic}
      translation={translation}
    />
  );
};
