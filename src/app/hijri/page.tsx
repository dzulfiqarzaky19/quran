import type { Metadata } from "next";
import { HijriView } from "@/components/hijri/HijriView";

export const metadata: Metadata = {
  title: "Hijri calendar & fasting | AL-QURAN",
  description: "Today's Hijri date, the Islamic month at a glance, imsak and iftar times, and a fasting tracker.",
};

export default function HijriPage() {
  return <HijriView />;
}
