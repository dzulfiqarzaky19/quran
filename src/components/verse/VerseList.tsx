import {
  fetchVerses,
  fetchSurahTajweed,
} from "@/lib/api";
import { InfiniteVerseList } from "./InfiniteVerseList";

interface VerseListProps {
  surahNo: number;
}

export async function VerseList({ surahNo }: VerseListProps) {
  // Fetch first page of verses (10 verses) and full Tajweed markers
  const [versesData, tajweedData] = await Promise.all([
    fetchVerses(surahNo, 1, 10),
    fetchSurahTajweed(surahNo),
  ]);

  return (
    <InfiniteVerseList
      surahNo={surahNo}
      initialVerses={versesData.verses}
      initialPage={1}
      totalPages={versesData.pagination.total_pages}
      initialTajweedData={tajweedData}
    />
  );
}
