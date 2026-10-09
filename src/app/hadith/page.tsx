import { HADITH_COLLECTIONS } from "@/lib/hadith";
import { HadithRow } from "@/components/hadith/HadithRow";

export default function HadithPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col">
      <div className="mb-6 flex items-baseline justify-between gap-4 px-3">
        <h1 className="text-title-lg font-bold tracking-tight">Hadith</h1>
        <p className="shrink-0 text-label-sm uppercase tracking-[0.05em] text-on-surface-variant">
          {HADITH_COLLECTIONS.length} collections
        </p>
      </div>

      <ol className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-x-8">
        {HADITH_COLLECTIONS.map((collection, index) => (
          <li key={collection.id} className="min-w-0">
            <HadithRow
              href={`/hadith/${collection.id}`}
              index={index + 1}
              title={collection.title}
              subtitle={collection.description}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
