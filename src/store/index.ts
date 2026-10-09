import { create } from 'zustand';
import { ChapterAudioResponse } from '@/lib/types';
import { RepeatRange } from '@/lib/hifz';

interface AppState {
  // Audio State
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  activeAudioAyah: number | null;
  setActiveAudioAyah: (ayah: number | null) => void;
  activeAudioWord: number | null;
  setActiveAudioWord: (word: number | null) => void;
  audioData: ChapterAudioResponse | null;
  setAudioData: (data: ChapterAudioResponse | null) => void;
  repeat: RepeatRange | null;
  setRepeat: (repeat: RepeatRange | null) => void;

  // UI State
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Audio Defaults
  isPlaying: false,
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  activeAudioAyah: null,
  setActiveAudioAyah: (ayah) => set({ activeAudioAyah: ayah }),
  activeAudioWord: null,
  setActiveAudioWord: (word) => set({ activeAudioWord: word }),
  audioData: null,
  setAudioData: (data) => set({ audioData: data }),
  repeat: null,
  setRepeat: (repeat) => set({ repeat }),

  // Settings Defaults
  isSettingsOpen: false,
  setIsSettingsOpen: (open) => set({ isSettingsOpen: open }),
}));
