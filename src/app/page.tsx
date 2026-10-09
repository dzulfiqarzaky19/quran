import { fetchSurahList } from "@/lib/api";
import { SurahList } from "@/components/surah/SurahList";
import { ReadingResume } from "@/components/reading/ReadingResume";
import { DzikirOfTheDay } from "@/components/dzikir/DzikirOfTheDay";
import { getDailyDzikir } from "@/lib/dzikir";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home(props: PageProps) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";

  const [rawSurahs, dailyDzikir] = await Promise.all([fetchSurahList(), getDailyDzikir(new Date())]);
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
    <div className="mx-auto flex w-full max-w-5xl flex-col">
      <div className="mb-6 flex items-baseline justify-between gap-4 px-3">
        <h1 className="text-title-lg font-bold tracking-tight">Al-Quran</h1>
        <p className="shrink-0 text-label-sm uppercase tracking-[0.05em] text-on-surface-variant">
          {q ? `${filteredSurahs.length} of ${surahs.length}` : `${surahs.length} surahs`}
        </p>
      </div>

      {!q && <ReadingResume surahNames={surahs.map((s) => s.surahName)} />}
      {!q && <DzikirOfTheDay {...dailyDzikir} />}

      <SurahList surahs={filteredSurahs} searchQuery={q} />
    </div>
  );
}
