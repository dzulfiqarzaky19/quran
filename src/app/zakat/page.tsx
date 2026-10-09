import type { Metadata } from "next";
import { ZakatCalculator } from "@/components/zakat/ZakatCalculator";

export const metadata: Metadata = {
  title: "Zakat calculator | AL-QURAN",
  description: "Work out zakat on gold, savings and income against the nisab.",
};

export default function ZakatPage() {
  return <ZakatCalculator />;
}
