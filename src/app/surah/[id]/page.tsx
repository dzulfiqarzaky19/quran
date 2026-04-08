import { fetchSurah, fetchIndonesianTranslation } from "@/lib/api";
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

  const tafsirAyahStr = resolvedSearchParams.tafsir;
  const targetAyah =
    typeof tafsirAyahStr === "string" ? parseInt(tafsirAyahStr, 10) : null;

  const [surahData, indonesianTexts] = await Promise.all([
    fetchSurah(surahId),
    fetchIndonesianTranslation(surahId),
  ]);

  let tafsirArabic = "";
  let tafsirTranslation = "";

  if (targetAyah && targetAyah >= 1 && targetAyah <= surahData.totalAyah) {
    const idx = targetAyah - 1;
    tafsirArabic = surahData.arabic1[idx];
    tafsirTranslation = indonesianTexts[idx];
  }

  return (
    <div className="flex flex-col">
      <SurahHeader
        surahNo={surahId}
        surahName={surahData.surahName}
        surahNameArabic={surahData.surahNameArabicLong}
        surahNameTranslation={surahData.surahNameTranslation}
        totalAyah={surahData.totalAyah}
        revelationPlace={surahData.revelationPlace}
      />

      <div className="mb-4 text-center">
        <div className="h-1 w-full max-w-2xl mx-auto rounded-full bg-surface-container overflow-hidden">
          <div className="h-full bg-primary flex" style={{ width: "10%" }} />
        </div>
        <div className="text-label-sm tracking-widest text-on-surface-variant uppercase mt-4">
          READING
        </div>
      </div>

      <div className="mt-8">
        <VerseList
          surahNo={surahId}
          arabicVars={surahData.arabic1}
          englishVars={surahData.english}
          indonesianVars={indonesianTexts}
        />
      </div>

      <SurahNavigation surahNo={surahId} />

      {targetAyah && (
        <TafsirModal
          surah={surahId}
          ayah={targetAyah}
          arabic={tafsirArabic}
          translation={tafsirTranslation}
        />
      )}
    </div>
  );
}
