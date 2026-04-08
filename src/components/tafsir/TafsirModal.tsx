import Link from "next/link";
import { Suspense } from "react";
import { TafsirFetcher } from "./TafsirFetcher";
import { fetchSurah, fetchIndonesianTranslation } from "@/lib/api";

interface TafsirModalProps {
  surah: number;
  ayah: number;
}

export const TafsirModal = async ({
  surah,
  ayah,
}: TafsirModalProps) => {
  const [surahData, indonesianTexts] = await Promise.all([
    fetchSurah(surah),
    fetchIndonesianTranslation(surah),
  ]);

  const arabic = surahData.arabic1[ayah - 1] || "";
  const translation = indonesianTexts[ayah - 1] || "";

  return (
  <div className="fixed inset-0 z-100 flex items-center justify-center p-0 md:p-6">
    <Link
      href="?"
      scroll={false}
      replace
      className="absolute inset-0 bg-surface-dim/80 backdrop-blur-sm"
      aria-label="Close modal"
    />
    <div className="relative w-full h-full md:h-[90vh] md:max-w-6xl glass md:rounded-3xl overflow-hidden flex flex-col shadow-2xl pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
      <div className="flex-1 overflow-hidden">
        <Suspense
          fallback={
            <div className="flex flex-col md:flex-row h-full">
              <div className="w-full md:w-72 bg-surface-container/80 p-6 border-r border-outline-variant/15 shrink-0 animate-pulse" />
              <div className="flex-1 p-6 md:p-12 animate-pulse" />
            </div>
          }
        >
          <TafsirFetcher
            surah={surah}
            ayah={ayah}
            arabic={arabic}
            translation={translation}
          />
        </Suspense>
      </div>
    </div>
  </div>
  );
};
