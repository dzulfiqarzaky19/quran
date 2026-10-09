import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Al-Quran",
    short_name: "Quran",
    description: "Quran reader with prayer times, Qibla, dzikir, tasbih and the Hijri calendar.",
    start_url: "/",
    display: "standalone",
    background_color: "#131315",
    theme_color: "#131315",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Prayer times", url: "/prayer" },
      { name: "Dzikir", url: "/dzikir" },
      { name: "Tasbih", url: "/tasbih" },
    ],
  };
}
