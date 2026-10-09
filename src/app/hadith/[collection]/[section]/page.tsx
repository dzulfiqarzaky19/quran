import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getHadithCollection, getHadithSection } from "@/lib/hadith";
import { HadithCard } from "@/components/hadith/HadithCard";
import { HadithSource } from "@/components/hadith/HadithSource";

interface IHadithSectionPageProps {
  params: Promise<{ collection: string; section: string }>;
}

export default async function HadithSectionPage({ params }: IHadithSectionPageProps) {
  const { collection: collectionId, section: sectionId } = await params;
  const collection = getHadithCollection(collectionId);

  // Only whole numbers name a book; anything else never reaches the API
  if (!collection || !/^\d+$/.test(sectionId)) {
    notFound();
  }

  const section = await getHadithSection(collection.id, Number(sectionId));

  if (!section) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      <Link
        href={`/hadith/${collection.id}`}
        className="mb-4 flex h-11 items-center gap-1 self-start rounded-xl pr-3 text-body-sm font-semibold text-on-surface-variant transition-colors hover:text-primary active:scale-[0.98]"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        {collection.title}
      </Link>

      <div className="mb-6 px-1">
        <h1 className="text-title-lg font-bold tracking-tight">{section.title}</h1>
        <p className="text-label-sm uppercase tracking-[0.05em] text-on-surface-variant">
          {section.hadiths.length} {section.hadiths.length === 1 ? "hadith" : "hadiths"}
        </p>
      </div>

      <ol className="flex flex-col gap-4">
        {section.hadiths.map((hadith) => (
          <HadithCard key={hadith.number} {...hadith} />
        ))}
      </ol>

      <HadithSource />
    </div>
  );
}
