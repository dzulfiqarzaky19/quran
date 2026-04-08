"use client";

import { TafsirResponse } from "@/lib/types";
import { FormatContent } from "./FormatContent";
import { useTransition, useMemo, Suspense, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { NotFound } from "./NotFound";

interface TafsirViewerProps {
  data: TafsirResponse;
  surah: number;
  ayah: number;
  arabic: string;
  translation: string;
}

export const TafsirModalContent = ({
  data,
  surah,
  ayah,
  arabic,
  translation,
}: TafsirViewerProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeAuthor = searchParams.get("author") || "ibn-kathir";
  const [isPending, startTransition] = useTransition();

  const handleAuthorChange = useCallback(
    (author: string) => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("author", author);
        params.set("tafsir", ayah.toString());
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [searchParams, ayah, router, pathname],
  );

  const currentTafsir = useMemo(() => {
    return (
      data.tafsirs.find(
        (t) => t.author.toLowerCase().replace(/\s+/g, "-") === activeAuthor,
      ) || data.tafsirs[0]
    );
  }, [activeAuthor]);

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden">
      <Sidebar
        surahNo={data.surahNo}
        ayahNo={ayah}
        activeAuthor={activeAuthor}
        onAuthorChange={handleAuthorChange}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden bg-surface-bright/50">
        <Header surah={surah} ayah={ayah} />

        <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
          <div className="p-6 md:p-12 max-w-4xl mx-auto w-full">
            {(arabic || translation) && (
              <div className="glass rounded-2xl p-6 md:p-8 border border-outline-variant/20 mb-12">
                {arabic && (
                  <p
                    className="text-headline-sm md:text-headline-md font-arabic text-on-surface leading-loose text-center mb-6"
                    dir="rtl"
                  >
                    {arabic}
                  </p>
                )}

                {translation && (
                  <div className="pt-6 border-t border-outline-variant/10">
                    <p className="text-body-lg text-on-surface-variant italic text-center leading-relaxed">
                      "{translation}"
                    </p>
                  </div>
                )}
              </div>
            )}

            {currentTafsir ? (
              <Suspense fallback={isPending ? <div>Loading...</div> : null}>
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <FormatContent
                    content={currentTafsir.content}
                    author={currentTafsir.author}
                  />
                </div>
              </Suspense>
            ) : (
              <NotFound />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
