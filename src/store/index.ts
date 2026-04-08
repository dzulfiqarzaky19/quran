import { create } from 'zustand';

interface AppState {
  activeVerse: number | null;
  setActiveVerse: (ayah: number | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeVerse: null,
  setActiveVerse: (ayah) => set({ activeVerse: ayah }),
}));
