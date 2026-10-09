import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CalculationMethodId, DEFAULT_METHOD, PrayerLocation } from '@/lib/prayer';

interface PrayerState {
  location: PrayerLocation | null;
  setLocation: (location: PrayerLocation) => void;
  method: CalculationMethodId;
  setMethod: (method: CalculationMethodId) => void;
}

// Kept apart from useAppStore so only these two settings reach localStorage
export const usePrayerStore = create<PrayerState>()(
  persist(
    (set) => ({
      location: null,
      setLocation: (location) => set({ location }),
      method: DEFAULT_METHOD,
      setMethod: (method) => set({ method }),
    }),
    { name: 'quran-prayer' },
  ),
);
