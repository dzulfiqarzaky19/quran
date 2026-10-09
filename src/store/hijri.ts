import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface HijriState {
  /** Days the local sighting runs ahead of (+) or behind (-) the Umm al-Qura calendar. */
  adjustment: number;
  setAdjustment: (adjustment: number) => void;
  /** Gregorian days (YYYY-MM-DD) marked as fasted. */
  fasted: string[];
  toggleFasted: (day: string) => void;
}

// Kept apart from useAppStore so only the calendar offset and the fasting log reach localStorage
export const useHijriStore = create<HijriState>()(
  persist(
    (set) => ({
      adjustment: 0,
      setAdjustment: (adjustment) => set({ adjustment }),
      fasted: [],
      toggleFasted: (day) =>
        set((state) => ({
          fasted: state.fasted.includes(day)
            ? state.fasted.filter((d) => d !== day)
            : [...state.fasted, day],
        })),
    }),
    { name: 'quran-hijri' },
  ),
);
