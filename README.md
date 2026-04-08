# 📖 Quran App

A modern, beautiful Quran web application built with Next.js — featuring Quran text, translations, audio recitation, and tafseer.

> Accessible everywhere — optimized for desktop, tablet, and mobile.

---

## ✨ Features

- **Quran Text** — Arabic with tashkeel (diacritics) and without
- **Translation** — English, Bengali, and Urdu translations
- **Audio Recitation** — 5 renowned reciters with per-verse and full-chapter playback
- **Tafseer** — 3 major tafsirs: Ibn Kathir, Maarif Ul Quran, Tazkirul Quran

---

## 🛠 Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | SSR/SSG for SEO, dynamic routes (`/surah/[id]`), ISR for performance |
| **Language** | TypeScript | Type safety across API responses and components |
| **Styling** | Tailwind CSS | Included with Next.js, utility-first for rapid UI development |
| **Fonts** | Amiri (Arabic), Inter (UI) | Beautiful Arabic typography + clean modern UI font |
| **Audio** | HTML5 `<audio>` + custom player | Native performance, custom-styled playback controls |
| **State** | Zustand | Lightweight store for audio player state, reading preferences |
| **Deployment** | Vercel | Free tier, global CDN, native Next.js support |

---

## 🔌 API Reference

**Base URL:** `https://quranapi.pages.dev/api/`

> Open-source, free-to-use, no rate limit. All responses in JSON format.

### Endpoints

| Endpoint | URL Pattern | Description |
|---|---|---|
| Surah List | `GET /surah.json` | All 114 surahs — names, ayah count, revelation place |
| Full Chapter | `GET /{surahNo}.json` | Complete surah with Arabic, translations, and audio |
| Single Verse | `GET /{surahNo}/{ayahNo}.json` | Individual ayah with all data |
| Tafsir (Verse) | `GET /tafsir/{surahNo}_{ayahNo}.json` | 3 tafsirs for a specific verse (markdown format) |
| Tafsir (Surah) | `GET /tafsir/{surahNo}.json` | 3 tafsirs for entire surah |
| Audio (Verse) | `GET /audio/{surahNo}/{ayahNo}.json` | MP3 URLs from 5 reciters for one verse |
| Audio (Chapter) | `GET /audio/{surahNo}.json` | Full chapter MP3 URLs from 5 reciters |
| Reciters | `GET /reciters.json` | List of available reciters |

### Available Reciters

| # | Reciter |
|---|---|
| 1 | Mishary Rashid Al Afasy |
| 2 | Abu Bakr Al Shatri |
| 3 | Nasser Al Qatami |
| 4 | Yasser Al Dosari |
| 5 | Hani Ar Rifai |

### Available Tafsirs

1. **Ibn Kathir** — Classical, widely referenced
2. **Maarif Ul Quran** — Comprehensive Hanafi perspective
3. **Tazkirul Quran** — Modern commentary

> Tafsir content is in Markdown format. `groupVerse` field indicates when a tafsir covers a group of verses.

### Example Response — Single Verse

```
GET /api/1/2.json
```

```json
{
  "surahName": "Al-Faatiha",
  "surahNameArabic": "الفاتحة",
  "surahNameArabicLong": "سُورَةُ ٱلْفَاتِحَةِ",
  "surahNameTranslation": "The Opening",
  "revelationPlace": "Mecca",
  "totalAyah": 7,
  "surahNo": 1,
  "ayahNo": 2,
  "audio": {
    "1": {
      "reciter": "Mishary Rashid Al Afasy",
      "url": "https://the-quran-project.github.io/Quran-Audio/Data/1/1_2.mp3"
    }
  },
  "english": "All praise is for Allah—Lord of all worlds",
  "arabic1": "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ",
  "arabic2": "الحمد لله رب العالمين"
}
```

---

## 📁 Project Structure (Planned)

```
src/
├── app/
│   ├── layout.tsx            # Root layout with fonts, metadata
│   ├── page.tsx              # Home — surah list
│   ├── surah/
│   │   └── [id]/
│   │       ├── page.tsx      # Surah reader view
│   │       └── [ayah]/
│   │           └── page.tsx  # Single ayah + tafsir view
│   └── globals.css           # Tailwind directives + custom styles
├── components/
│   ├── ui/                   # Reusable UI components
│   ├── audio-player/         # Custom audio player
│   ├── surah-card/           # Surah list card
│   └── verse/                # Verse display component
├── lib/
│   ├── api.ts                # API client functions
│   └── types.ts              # TypeScript interfaces
└── store/
    └── index.ts              # Zustand store (audio, preferences)
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

---

## 📝 License

MIT

---

<p align="center">
  <i>Built with ❤️ for the Ummah</i>
</p>
