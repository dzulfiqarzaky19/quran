import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getDzikirCategories, getDzikirCategory, DZIKIR_SOURCE } from "@/lib/dzikir";
import { DzikirCard } from "@/components/dzikir/DzikirCard";

interface IDzikirCategoryPageProps {
  params: Promise<{ id: string }>;
}

// Every category is in the local snapshot, so all pages are built ahead of time
export const dynamicParams = false;

export function generateStaticParams() {
  return getDzikirCategories().map((c) => ({ id: String(c.id) }));
}

export default async function DzikirCategoryPage({ params }: IDzikirCategoryPageProps) {
  const { id } = await params;
  const category = await getDzikirCategory(Number(id));

  if (!category) {
    notFound();
  }

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
        <h1 className="text-title-lg font-bold tracking-tight first-letter:uppercase">
          {category.title}
        </h1>
        <p className="text-label-sm uppercase tracking-[0.05em] text-on-surface-variant">
          {category.count} {category.count === 1 ? "dua" : "duas"}
        </p>
      </div>

      <ol className="flex flex-col gap-4">
        {category.items.map((item) => (
          <DzikirCard key={item.id} item={item} />
        ))}
      </ol>

      <p className="mt-8 px-1 text-label-sm text-on-surface-variant">
        Source: Hisnul Muslim, {new URL(DZIKIR_SOURCE).hostname}
      </p>
    </div>
  );
}
