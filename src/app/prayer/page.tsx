import type { Metadata } from "next";
import { PrayerView } from "@/components/prayer/PrayerView";

export const metadata: Metadata = {
  title: "Prayer times & Qibla | AL-QURAN",
  description: "Today's prayer times, a countdown to the next prayer, and the Qibla direction for your location.",
};

export default function PrayerPage() {
  return <PrayerView />;
}
