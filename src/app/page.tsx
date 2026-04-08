import { fetchSurahList } from "@/lib/api";
import { SurahList } from "@/components/surah/SurahList";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home(props: PageProps) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";

  const rawSurahs = await fetchSurahList();
  const surahs = rawSurahs.map((s, idx) => ({ ...s, surahNo: idx + 1 }));

  const filteredSurahs = surahs.filter((s) => {
    if (!q) return true;
    const lower = q.toLowerCase();
    return (
      s.surahName.toLowerCase().includes(lower) ||
      s.surahNameTranslation.toLowerCase().includes(lower) ||
      s.surahNo.toString() === lower
    );
  });

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

      <SurahList surahs={filteredSurahs} searchQuery={q} />
    </div>
  );
}
