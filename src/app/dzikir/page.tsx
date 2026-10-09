import Link from "next/link";
import { ChevronRight, Sun } from "lucide-react";
import { getDzikirCategories, FEATURED_DZIKIR_IDS } from "@/lib/dzikir";
import { DzikirCategoryList } from "@/components/dzikir/DzikirCategoryList";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DzikirPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";

  const categories = getDzikirCategories();
  const lower = q.toLowerCase();
  const filtered = categories.filter((c) => !q || c.title.toLowerCase().includes(lower));
  const featured = FEATURED_DZIKIR_IDS.flatMap((id) => categories.find((c) => c.id === id) ?? []);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col">
      <div className="mb-6 flex items-baseline justify-between gap-4 px-3">
        <h1 className="text-title-lg font-bold tracking-tight">Dzikir &amp; Dua</h1>
        <p className="shrink-0 text-label-sm uppercase tracking-[0.05em] text-on-surface-variant">
          {q ? `${filtered.length} of ${categories.length}` : `${categories.length} topics`}
        </p>
      </div>

      {!q && (
        <section className="mb-8">
          <h2 className="mb-2 px-3 text-label-sm uppercase tracking-[0.05em] text-on-surface-variant">
            Daily
          </h2>
          <Link
            href="/dzikir/daily"
            className="mb-1 flex min-h-16 items-center gap-3 rounded-xl bg-surface-container-low px-3 py-2 transition-colors hover:bg-surface-container active:scale-[0.98] active:bg-surface-container-high"
          >
            <Sun className="h-5 w-8 shrink-0 text-primary" aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block text-body-lg font-semibold text-on-surface">Everyday duas</span>
              <span className="block text-body-sm text-on-surface-variant">
                From waking up to going to sleep
              </span>
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-on-surface-variant" aria-hidden="true" />
          </Link>
          <DzikirCategoryList categories={featured} />
        </section>
      )}

      {filtered.length === 0 ? (
        <p className="px-3 py-20 text-body-lg text-on-surface-variant">
          No topic matches &quot;{q}&quot;. Try a word like sleep, travel or prayer.
        </p>
      ) : (
        <section>
          {!q && (
            <h2 className="mb-2 px-3 text-label-sm uppercase tracking-[0.05em] text-on-surface-variant">
              All topics
            </h2>
          )}
          <DzikirCategoryList categories={filtered} />
        </section>
      )}
    </div>
  );
}
