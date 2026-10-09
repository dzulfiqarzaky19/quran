import type { Metadata } from "next";
import { fetchSurahList } from "@/lib/api";
import { ReadingView } from "@/components/reading/ReadingView";

export const metadata: Metadata = {
  title: "Your reading | AL-QURAN",
  description: "Pick up where you stopped, track a khatam with a daily verse target, and open your bookmarked verses.",
};

export const revalidate = 86400; // Cache for 24 hours

export default async function ReadingPage() {
  const surahs = await fetchSurahList();

  return <ReadingView surahNames={surahs.map((s) => s.surahName)} />;
}
