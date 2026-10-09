"use client";

import Link from "next/link";
import { useHydrated } from "@/hooks/useHydrated";
import { memorizedTotal, surahProgress } from "@/lib/hifz";
import { TOTAL_AYAHS, ayahHref } from "@/lib/reading";
import { useHifzStore } from "@/store/hifz";
import { HifzModeSwitch } from "./HifzModeSwitch";

interface HifzViewProps {
  surahNames: string[];
}

const sectionLabel = "mb-3 px-3 text-label-sm uppercase tracking-[0.05em] text-on-surface-variant";

export function HifzView({ surahNames }: HifzViewProps) {
  const hydrated = useHydrated();
  const memorized = useHifzStore((state) => state.memorized);

  // Memorization progress only exists in the browser
  if (!hydrated) {
    return (
      <div className="mx-auto flex w-full max-w-xl animate-pulse flex-col gap-10">
        <div className="h-40 rounded-2xl bg-surface-container-low" />
        <div className="h-20 rounded-xl bg-surface-container-low" />
      </div>
    );
  }

  const total = memorizedTotal(memorized);
  const surahs = surahProgress(memorized);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-10">
      <h1 className="px-3 text-title-lg font-bold tracking-tight">Hifz</h1>

      <div className="rounded-2xl bg-surface-container-low p-6">
        <p className="text-display-lg font-bold tabular-nums">
          {total}
          <span className="ml-2 text-title-lg font-semibold text-on-surface-variant">
            of {TOTAL_AYAHS} verses
          </span>
        </p>
        <div
          role="progressbar"
          aria-label="Memorized verses"
          aria-valuemin={0}
          aria-valuemax={TOTAL_AYAHS}
          aria-valuenow={total}
          className="mt-3 h-0.5 w-full bg-secondary-container"
        >
          <div
            className="h-full origin-left bg-primary"
            style={{ transform: `scaleX(${total / TOTAL_AYAHS})` }}
          />
        </div>
        <p className="mt-3 text-body-sm text-on-surface-variant">
          Turn on hifz mode, open a surah and recite each hidden verse before you tap it. Mark the
          ones you know with the check under the verse. To drill a passage, use the repeat button
          in the audio bar.
        </p>
      </div>

      <HifzModeSwitch className="w-full rounded-xl bg-surface-container-low p-4" />

      <section aria-labelledby="hifz-surahs-label">
        <h2 id="hifz-surahs-label" className={sectionLabel}>
          Surahs in progress
        </h2>
        {surahs.length === 0 ? (
          <p className="px-3 text-body-lg text-on-surface-variant">
            Nothing marked yet.{" "}
            <Link href="/" className="font-semibold text-primary">
              Pick a surah
            </Link>{" "}
            to start.
          </p>
        ) : (
          <ul className="flex flex-col gap-1">
            {surahs.map((surah) => (
              <li key={surah.surahNo}>
                <Link
                  href={ayahHref(surah.next ?? { surahNo: surah.surahNo, ayahNo: 1 })}
                  className="flex min-h-14 flex-col justify-center gap-2 rounded-xl px-3 py-3 transition-colors hover:bg-surface-container-low active:scale-[0.98] active:bg-surface-container-high"
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-body-lg text-on-surface">
                      {surahNames[surah.surahNo - 1] ?? `Surah ${surah.surahNo}`}
                    </span>
                    <span className="shrink-0 text-body-sm tabular-nums text-on-surface-variant">
                      {surah.next ? `${surah.memorized} of ${surah.total}` : "Complete"}
                    </span>
                  </span>
                  <span className="block h-0.5 w-full bg-secondary-container">
                    <span
                      className="block h-full origin-left bg-primary"
                      style={{ transform: `scaleX(${surah.memorized / surah.total})` }}
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
