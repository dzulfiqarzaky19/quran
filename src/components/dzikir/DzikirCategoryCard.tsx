import Link from "next/link";
import { DzikirCategory } from "@/lib/types";

interface DzikirCategoryCardProps {
  category: DzikirCategory;
}

export const DzikirCategoryCard = ({ category }: DzikirCategoryCardProps) => (
  <Link
    href={`/dzikir/${category.id}`}
    className="flex min-h-16 items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-surface-container-low active:scale-[0.98] active:bg-surface-container-high"
  >
    <span className="w-8 shrink-0 text-label-sm font-medium tabular-nums tracking-[0.05em] text-primary">
      {category.id}
    </span>
    <span className="min-w-0 flex-1">
      <span className="block text-body-lg font-semibold text-on-surface first-letter:uppercase">
        {category.title}
      </span>
      <span className="block text-body-sm text-on-surface-variant">
        {category.count} {category.count === 1 ? "dua" : "duas"}
      </span>
    </span>
  </Link>
);
