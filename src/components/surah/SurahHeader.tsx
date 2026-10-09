import { fetchSurah } from "@/lib/api";

interface SurahHeaderProps {
  surahNo: number;
}

export const SurahHeader = async ({ surahNo }: SurahHeaderProps) => {
  const {
    surahName,
    surahNameArabic,
    surahNameTranslation,
    totalAyah,
    revelationPlace,
  } = await fetchSurah(surahNo);

  return (
    <section className="flex min-h-[100svh] snap-start flex-col items-center justify-center gap-4 py-24 text-center">
      <p
        className="font-arabic text-[2.5rem] leading-[1.8] text-on-surface"
        dir="rtl"
      >
        {surahNameArabic}
      </p>
      <h1 className="min-w-0 text-display-lg font-bold text-on-surface [overflow-wrap:anywhere]">
        {surahName}
      </h1>
      <p className="text-body-lg text-on-surface-variant">
        {surahNameTranslation}
      </p>
      <p className="text-label-sm text-on-surface-variant tracking-[0.05em] uppercase">
        {revelationPlace} • {totalAyah} VERSES
      </p>

      {surahNo !== 1 && surahNo !== 9 && (
        <p
          className="mt-10 font-arabic text-[2rem] leading-[2.2] text-on-surface"
          dir="rtl"
        >
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </p>
      )}
    </section>
  );
};
