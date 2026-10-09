import { SurahHeader } from "@/components/surah/SurahHeader";
import { SurahNavigation } from "@/components/surah/SurahNavigation";
import { VerseList } from "@/components/verse/VerseList";
import { TafsirModal } from "@/components/tafsir/TafsirModal";
import { notFound } from "next/navigation";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { fetchSurah, fetchRecitations, fetchTranslations } from "@/lib/api";
import { SettingsSidebar } from "@/components/layout/SettingsSidebar";
import { ReadingBar } from "@/components/layout/ReadingBar";

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
    <div className="reader-snap mx-auto flex w-full max-w-2xl flex-col">
      <ReadingBar surah={surah} />

      <SurahHeader surahNo={surahId} />

      <Suspense fallback={
        <div className="min-h-[100svh] animate-pulse rounded-3xl bg-surface-container" />
      }>
        <VerseList 
          surahNo={surahId} 
          totalVerses={surah.totalAyah} 
          translationId={translationId}
        />
      </Suspense>

      <SurahNavigation surahNo={surahId} />

      {targetAyah > 0 && <TafsirModal surah={surahId} ayah={targetAyah} />}

      <AudioPlayer surahNo={surahId} reciterId={reciterId} />

      <SettingsSidebar 
        initialRecitations={recitations} 
        initialTranslations={translations} 
      />
    </div>
  );
}
