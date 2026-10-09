import type { Metadata } from "next";
import { fetchSurahList } from "@/lib/api";
import { HifzView } from "@/components/hifz/HifzView";

export const metadata: Metadata = {
  title: "Hifz | AL-QURAN",
  description: "Memorize the Quran: hide each verse until you recite it, repeat a range of verses and track what you have memorized.",
};

export const revalidate = 86400; // Cache for 24 hours

export default async function HifzPage() {
  const surahs = await fetchSurahList();

  return <HifzView surahNames={surahs.map((s) => s.surahName)} />;
}
