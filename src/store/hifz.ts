import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AyahRef } from '@/lib/reading';
import { Memorized, toggleMemorized } from '@/lib/hifz';

interface HifzState {
  memorized: Memorized;
  /** Hifz mode: verses in the reader stay hidden until tapped. */
  hideVerses: boolean;
  toggleMemorized: (ref: AyahRef) => void;
  setHideVerses: (hide: boolean) => void;
}

// Kept apart from useAppStore so only memorization progress is written to localStorage
export const useHifzStore = create<HifzState>()(
  persist(
    (set) => ({
      memorized: {},
      hideVerses: false,
      toggleMemorized: (ref) =>
        set((state) => ({ memorized: toggleMemorized(state.memorized, ref) })),
      setHideVerses: (hide) => set({ hideVerses: hide }),
    }),
    { name: 'quran-hifz' },
  ),
);
