import type { Metadata } from "next";
import { Inter, Amiri } from "next/font/google";
import "./globals.css";
import { TopBar } from "@/components/layout/TopBar";
import { TafsirModal } from "@/components/tafsir/TafsirModal";

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const amiriFont = Amiri({
  weight: ["400", "700"],
  variable: "--font-amiri",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "AL-QURAN | The Sacred Lens",
  description: "A premium, high-precision editorial Quran reading experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${interFont.variable} ${amiriFont.variable} antialiased`}>
      <body className="font-sans min-h-screen flex flex-col bg-surface-dim text-on-surface selection:bg-primary-container selection:text-white pb-32">
        <TopBar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
          {children}
        </main>
        <TafsirModal />
      </body>
    </html>
  );
}
