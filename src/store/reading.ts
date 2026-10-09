import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AyahRef, Khatam, advanceKhatam, localDay } from '@/lib/reading';

export interface Bookmark extends AyahRef {
  addedAt: number;
}

interface ReadingState {
  lastRead: AyahRef | null;
  bookmarks: Bookmark[];
  khatam: Khatam | null;
  markRead: (ref: AyahRef) => void;
  toggleBookmark: (ref: AyahRef) => void;
  startKhatam: (targetDays: number, startPosition: number) => void;
  endKhatam: () => void;
}

const isSameAyah = (a: AyahRef, b: AyahRef) => a.surahNo === b.surahNo && a.ayahNo === b.ayahNo;

// Kept apart from useAppStore so only reading history is written to localStorage
export const useReadingStore = create<ReadingState>()(
  persist(
    (set) => ({
      lastRead: null,
      bookmarks: [],
      khatam: null,
      markRead: ({ surahNo, ayahNo }) =>
        set((state) => ({
          lastRead: { surahNo, ayahNo },
          khatam:
            state.khatam && advanceKhatam(state.khatam, { surahNo, ayahNo }, localDay(new Date())),
        })),
      toggleBookmark: ({ surahNo, ayahNo }) =>
        set((state) => ({
          bookmarks: state.bookmarks.some((b) => isSameAyah(b, { surahNo, ayahNo }))
            ? state.bookmarks.filter((b) => !isSameAyah(b, { surahNo, ayahNo }))
            : [{ surahNo, ayahNo, addedAt: Date.now() }, ...state.bookmarks],
        })),
      startKhatam: (targetDays, startPosition) =>
        set({
          khatam: {
            position: startPosition,
            startPosition,
            targetDays,
            day: localDay(new Date()),
            dayStart: startPosition,
          },
        }),
      endKhatam: () => set({ khatam: null }),
    }),
    { name: 'quran-reading' },
  ),
);
