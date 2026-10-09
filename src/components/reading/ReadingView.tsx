"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useNow } from "@/hooks/useNow";
import { ayahHref, ayahLabel, localDay } from "@/lib/reading";
import { useReadingStore } from "@/store/reading";
import { KhatamCard } from "./KhatamCard";

interface ReadingViewProps {
  surahNames: string[];
}

const sectionLabel = "mb-3 px-3 text-label-sm uppercase tracking-[0.05em] text-on-surface-variant";

export function ReadingView({ surahNames }: ReadingViewProps) {
  const now = useNow();
  const lastRead = useReadingStore((state) => state.lastRead);
  const bookmarks = useReadingStore((state) => state.bookmarks);
  const toggleBookmark = useReadingStore((state) => state.toggleBookmark);

  // Reading history only exists in the browser
  if (!now) {
    return (
      <div className="mx-auto flex w-full max-w-xl animate-pulse flex-col gap-10">
        <div className="h-16 rounded-xl bg-surface-container-low" />
        <div className="h-56 rounded-2xl bg-surface-container-low" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-10">
      <h1 className="px-3 text-title-lg font-bold tracking-tight">Your reading</h1>

      <section aria-labelledby="last-read-label">
        <h2 id="last-read-label" className={sectionLabel}>
          Last read
        </h2>
        {lastRead ? (
          <Link
            href={ayahHref(lastRead)}
            className="flex min-h-16 items-center rounded-xl bg-surface-container-low px-3 text-body-lg font-semibold text-on-surface transition-colors hover:bg-surface-container active:scale-[0.98]"
          >
            {ayahLabel(surahNames, lastRead)}
          </Link>
        ) : (
          <p className="px-3 text-body-lg text-on-surface-variant">
            Open a surah and your place is kept here.
          </p>
        )}
      </section>

      <section aria-labelledby="khatam-label">
        <h2 id="khatam-label" className={sectionLabel}>
          Khatam
        </h2>
        <KhatamCard surahNames={surahNames} lastRead={lastRead} today={localDay(now)} />
      </section>

      <section aria-labelledby="bookmarks-label">
        <h2 id="bookmarks-label" className={sectionLabel}>
          Bookmarks
        </h2>
        {bookmarks.length === 0 ? (
          <p className="px-3 text-body-lg text-on-surface-variant">
            Tap the bookmark under a verse to save it here.
          </p>
        ) : (
          <ul className="flex flex-col gap-1">
            {bookmarks.map((bookmark) => (
              <li key={`${bookmark.surahNo}:${bookmark.ayahNo}`} className="flex items-center gap-1">
                <Link
                  href={ayahHref(bookmark)}
                  className="flex min-h-14 min-w-0 flex-1 items-center rounded-xl px-3 transition-colors hover:bg-surface-container-low active:scale-[0.98] active:bg-surface-container-high"
                >
                  <span className="truncate text-body-lg text-on-surface">
                    {ayahLabel(surahNames, bookmark)}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => toggleBookmark(bookmark)}
                  aria-label={`Remove bookmark ${ayahLabel(surahNames, bookmark)}`}
                  className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-primary active:scale-[0.98]"
                >
                  <X className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
