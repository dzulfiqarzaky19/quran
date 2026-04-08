import { SurahHeader } from "@/components/surah/SurahHeader";
import { SurahNavigation } from "@/components/surah/SurahNavigation";
import { VerseList } from "@/components/verse/VerseList";
import { TafsirModal } from "@/components/tafsir/TafsirModal";
import { notFound } from "next/navigation";

export const revalidate = 86400; // Cache for 24 hours

interface ISurahPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SurahPage({
  params,
  searchParams,
}: ISurahPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const surahId = parseInt(resolvedParams.id, 10);

  if (isNaN(surahId) || surahId < 1 || surahId > 114) {
    notFound();
  }

  const targetAyah = Number(resolvedSearchParams.tafsir) || 0;

  return (
    <div className="flex flex-col">
      <SurahHeader surahNo={surahId} />

      <div className="mb-4 text-center">
        <div className="h-1 w-full max-w-2xl mx-auto rounded-full bg-surface-container overflow-hidden">
          <div className="h-full bg-primary flex" style={{ width: "10%" }} />
        </div>
        <div className="text-label-sm tracking-widest text-on-surface-variant uppercase mt-4">
          READING
        </div>
      </div>

      <div className="mt-8">
        <VerseList surahNo={surahId} />
      </div>

      <SurahNavigation surahNo={surahId} />

      {targetAyah && <TafsirModal surah={surahId} ayah={targetAyah} />}
    </div>
  );
}
