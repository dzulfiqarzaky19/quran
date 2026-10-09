import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getEverydayDzikir, DZIKIR_SOURCE, EVERYDAY_INLINE_LIMIT } from "@/lib/dzikir";
import { DzikirCard } from "@/components/dzikir/DzikirCard";
import { DzikirCategoryCard } from "@/components/dzikir/DzikirCategoryCard";

export default async function EverydayDzikirPage() {
  const groups = await getEverydayDzikir();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      <Link
        href="/dzikir"
        className="mb-4 flex h-11 items-center gap-1 self-start rounded-xl pr-3 text-body-sm font-semibold text-on-surface-variant transition-colors hover:text-primary active:scale-[0.98]"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        All topics
      </Link>

      <div className="mb-6 px-1">
        <h1 className="text-title-lg font-bold tracking-tight">Everyday duas</h1>
        <p className="text-label-sm uppercase tracking-[0.05em] text-on-surface-variant">
          From waking up to going to sleep
        </p>
      </div>

      {groups.map((group) => (
        <section key={group.title} className="mb-10 flex flex-col gap-6">
          <h2 className="px-1 text-label-sm uppercase tracking-[0.05em] text-primary">{group.title}</h2>

          {group.topics.map(({ items, ...topic }) =>
            items.length > EVERYDAY_INLINE_LIMIT ? (
              <DzikirCategoryCard key={topic.id} category={topic} />
            ) : (
              <div key={topic.id} className="flex flex-col gap-3">
                <h3 className="px-1 text-body-lg font-semibold text-on-surface first-letter:uppercase">
                  {topic.title}
                </h3>
                <ol className="flex flex-col gap-4">
                  {items.map((item) => (
                    <DzikirCard key={item.id} item={item} />
                  ))}
                </ol>
              </div>
            ),
          )}
        </section>
      ))}

      <p className="px-1 text-label-sm text-on-surface-variant">
        Source: Hisnul Muslim, {new URL(DZIKIR_SOURCE).hostname}
      </p>
    </div>
  );
}
