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
