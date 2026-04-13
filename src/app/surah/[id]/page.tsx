import { SurahHeader } from "@/components/surah/SurahHeader";
import { SurahNavigation } from "@/components/surah/SurahNavigation";
import { VerseList } from "@/components/verse/VerseList";
import { TafsirModal } from "@/components/tafsir/TafsirModal";
import { notFound } from "next/navigation";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { fetchSurah, fetchRecitations, fetchTranslations } from "@/lib/api";
import { SettingsSidebar } from "@/components/layout/SettingsSidebar";

export const revalidate = 86400; // Cache for 24 hours

import { Suspense } from "react";

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

  // Get settings from URL or defaults
  const reciterId = Number(resolvedSearchParams.reciter) || 7;
  const translationId = Number(resolvedSearchParams.trans) || 33;
  const targetAyah = Number(resolvedSearchParams.tafsir) || 0;

  // Fetch Surah metadata + settings resources in parallel
  const [surah, recitations, translations] = await Promise.all([
    fetchSurah(surahId),
    fetchRecitations(),
    fetchTranslations(),
  ]);

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

      <div className="mt-8 mb-32">
        <Suspense fallback={
          <div className="space-y-8 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-full h-64 bg-surface-container rounded-3xl" />
            ))}
          </div>
        }>
          <VerseList 
            surahNo={surahId} 
            totalVerses={surah.totalAyah} 
            translationId={translationId}
          />
        </Suspense>
      </div>

      <SurahNavigation surahNo={surahId} />

      {targetAyah && <TafsirModal surah={surahId} ayah={targetAyah} />}

      <AudioPlayer surahNo={surahId} reciterId={reciterId} />

      <SettingsSidebar 
        initialRecitations={recitations} 
        initialTranslations={translations} 
      />
    </div>
  );
}
