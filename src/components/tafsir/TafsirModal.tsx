import { fetchTafsir } from "@/lib/api";
import { TafsirContent } from "./TafsirContent";
import Link from "next/link";

interface TafsirModalProps {
  surah: number;
  ayah: number;
  arabic: string;
  translation: string;
  source: string;
}

export async function TafsirModal({
  surah,
  ayah,
  arabic,
  translation,
  source,
}: TafsirModalProps) {
  let data = null;
  try {
    data = await fetchTafsir(surah, ayah);
  } catch (err) {
    console.error(err);
  }

  const currentTafsir =
    data?.tafsirs.find(
      (t) => t.author.toLowerCase().replace(/\s+/g, "-") === source,
    ) || data?.tafsirs[0];

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-0 md:p-6">
      <Link
        href="?"
        scroll={false}
        replace
        className="absolute inset-0 bg-surface-dim/80 backdrop-blur-sm"
        aria-label="Close modal"
      />

      <div className="relative w-full h-full md:h-auto md:max-w-5xl md:max-h-[90vh] glass md:rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl pointer-events-auto">
        <div className="w-full md:w-72 bg-surface-container/80 p-6 flex flex-col border-r border-outline-variant/15 shrink-0">
          <div className="flex justify-between flex-row-reverse md:flex-row items-center">
            <h3 className="text-label-sm tracking-widest text-primary font-bold uppercase">
              Deep Study
            </h3>
          </div>

          <div className="mb-4 md:mb-8 text-body-sm text-on-surface-variant mt-1">
            Verse {surah}:{ayah}
          </div>

          <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide">
            {["Ibn Kathir", "Maarif Ul Quran", "Tazkirul Quran"].map(
              (srcName) => {
                const sourceKey = srcName.toLowerCase().replace(/\s+/g, "-");
                const isActive = source === sourceKey;
                return (
                  <Link
                    key={sourceKey}
                    href={`?tafsir=${ayah}&source=${sourceKey}`}
                    scroll={false}
                    replace
                    className={`text-left px-5 py-4 text-label-sm font-bold tracking-[0.05em] uppercase rounded-xl transition-all whitespace-nowrap md:whitespace-normal ${isActive ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"}`}
                  >
                    {srcName}
                  </Link>
                );
              },
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden bg-surface-bright/50">
          <div className="hidden md:flex flex-col shrink-0 border-b border-outline-variant/15 p-2 md:p-4 bg-surface-container/30">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-title-lg font-bold text-on-surface">
                  Surah {surah}, Ayah {ayah}
                </h2>
                <p className="text-body-sm text-on-surface-variant mt-1">
                  Quranic Verse • Meaning and Reflection
                </p>
              </div>
              <Link
                href="?"
                scroll={false}
                replace
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors"
                aria-label="Close"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Link>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-12">
            {(arabic || translation) && (
              <div className="glass rounded-2xl p-6 border border-outline-variant/20 mb-10">
                {arabic && (
                  <p
                    className="text-headline-sm md:text-headline-md font-arabic text-on-surface leading-[2.5] text-center"
                    dir="rtl"
                  >
                    {arabic}
                  </p>
                )}
                {arabic && translation && (
                  <div className="w-16 h-px bg-outline-variant/30 mx-auto my-6" />
                )}
                {translation && (
                  <p className="text-body-md text-on-surface-variant italic">
                    "{translation}"
                  </p>
                )}
              </div>
            )}

            {data && currentTafsir ? (
              <div className="animate-in fade-in duration-300">
                <TafsirContent
                  content={currentTafsir.content}
                  author={currentTafsir.author}
                />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-on-surface-variant text-body-lg gap-4">
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
                Tafsir narrative not available for this verse.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
