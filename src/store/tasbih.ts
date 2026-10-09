import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const TASBIH_TARGETS = [33, 99, 100] as const;
export type TasbihTarget = (typeof TASBIH_TARGETS)[number] | null;

interface TasbihState {
  count: number;
  target: TasbihTarget;
  increment: () => void;
  reset: () => void;
  setTarget: (target: TasbihTarget) => void;
}

// Kept apart from useAppStore so only the counter is written to localStorage
export const useTasbihStore = create<TasbihState>()(
  persist(
    (set) => ({
      count: 0,
      target: 33,
      increment: () => set((state) => ({ count: state.count + 1 })),
      reset: () => set({ count: 0 }),
      setTarget: (target) => set({ target }),
    }),
    {
      name: 'tasbih',
      // Rehydrated by TasbihCounter after mount, so server and first client render agree
      skipHydration: true,
    }
  )
);
