import { create } from 'zustand';

interface AppState {
  tafsirOpen: boolean;
  tafsirVerse: { surah: number; ayah: number } | null;
  tafsirSource: string;
  activeVerse: number | null;
  searchQuery: string;
  
  openTafsir: (surah: number, ayah: number) => void;
  closeTafsir: () => void;
  setTafsirSource: (source: string) => void;
  setActiveVerse: (ayah: number | null) => void;
  setSearchQuery: (query: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  tafsirOpen: false,
  tafsirVerse: null,
  tafsirSource: 'ibn-kathir',
  activeVerse: null,
  searchQuery: '',
  
  openTafsir: (surah, ayah) => set({ tafsirOpen: true, tafsirVerse: { surah, ayah } }),
  closeTafsir: () => set({ tafsirOpen: false, tafsirVerse: null }),
  setTafsirSource: (source) => set({ tafsirSource: source }),
  setActiveVerse: (ayah) => set({ activeVerse: ayah }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
