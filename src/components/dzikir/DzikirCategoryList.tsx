import { DzikirCategory } from "@/lib/types";
import { DzikirCategoryCard } from "./DzikirCategoryCard";

interface DzikirCategoryListProps {
  categories: DzikirCategory[];
}

export const DzikirCategoryList = ({ categories }: DzikirCategoryListProps) => (
  <ol className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-x-8">
    {categories.map((category) => (
      <li key={category.id} className="min-w-0">
        <DzikirCategoryCard category={category} />
      </li>
    ))}
  </ol>
);
