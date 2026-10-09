import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import {
  getHadithCollection,
  getHadithSection,
  getHadithSections,
  searchHadith,
} from "@/lib/hadith";
import { HadithCard } from "@/components/hadith/HadithCard";
import { HadithRow } from "@/components/hadith/HadithRow";
import { HadithSource } from "@/components/hadith/HadithSource";

interface IHadithCollectionPageProps {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HadithCollectionPage({ params, searchParams }: IHadithCollectionPageProps) {
  const [{ collection: collectionId }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const collection = getHadithCollection(collectionId);

  if (!collection) {
    notFound();
  }

  const q = typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q.trim() : "";
  const [sections, search] = await Promise.all([
    getHadithSections(collection.id),
    q ? searchHadith(collection.id, q) : null,
  ]);
  // A collection with one book (the Forty Hadith) opens straight on its hadiths
  const onlySection =
    !search && sections.length === 1 ? await getHadithSection(collection.id, sections[0].id) : null;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col">
      <Link
        href="/hadith"
        className="mb-4 flex h-11 items-center gap-1 self-start rounded-xl pr-3 text-body-sm font-semibold text-on-surface-variant transition-colors hover:text-primary active:scale-[0.98]"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        All collections
      </Link>

      <div className="mb-6 flex items-baseline justify-between gap-4 px-3">
        <h1 className="text-title-lg font-bold tracking-tight">{collection.title}</h1>
        <p className="shrink-0 text-label-sm uppercase tracking-[0.05em] text-on-surface-variant">
          {search
            ? search.total > search.results.length
              ? `First ${search.results.length} of ${search.total}`
              : `${search.total} ${search.total === 1 ? "match" : "matches"}`
            : onlySection
              ? `${onlySection.hadiths.length} hadiths`
              : `${sections.length} books`}
        </p>
      </div>

      {search ? (
        search.results.length === 0 ? (
          <p className="px-3 py-20 text-body-lg text-on-surface-variant">
            No hadith matches &quot;{q}&quot;. Try a word like intention, prayer or fasting, or a hadith number.
          </p>
        ) : (
          <ol className="mx-auto flex w-full max-w-2xl flex-col gap-4">
            {search.results.map((result) => (
              <HadithCard
                key={result.number}
                number={result.number}
                text={result.text}
                href={
                  result.sectionId === null
                    ? undefined
                    : `/hadith/${collection.id}/${result.sectionId}#h-${result.number}`
                }
              />
            ))}
          </ol>
        )
      ) : onlySection ? (
        <ol className="mx-auto flex w-full max-w-2xl flex-col gap-4">
          {onlySection.hadiths.map((hadith) => (
            <HadithCard key={hadith.number} {...hadith} />
          ))}
        </ol>
      ) : (
        <ol className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-x-8">
          {sections.map((section) => (
            <li key={section.id} className="min-w-0">
              <HadithRow
                href={`/hadith/${collection.id}/${section.id}`}
                index={section.id}
                title={section.title}
                subtitle={`Hadith ${section.first} to ${section.last}`}
              />
            </li>
          ))}
        </ol>
      )}

      <HadithSource />
    </div>
  );
}
