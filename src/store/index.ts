import { create } from 'zustand';
import { ChapterAudioResponse } from '@/lib/types';

interface AppState {
  activeVerse: number | null;
  setActiveVerse: (ayah: number | null) => void;

  // Audio State
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  duration: number;
  setDuration: (duration: number) => void;
  playbackRate: number;
  setPlaybackRate: (rate: number) => void;
  activeAudioSurah: number | null;
  setActiveAudioSurah: (surah: number | null) => void;
  activeAudioAyah: number | null;
  setActiveAudioAyah: (ayah: number | null) => void;
  activeAudioWord: number | null;
  setActiveAudioWord: (word: number | null) => void;
  audioData: ChapterAudioResponse | null;
  setAudioData: (data: ChapterAudioResponse | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeVerse: null,
  setActiveVerse: (ayah) => set({ activeVerse: ayah }),

  // Audio Defaults
  isPlaying: false,
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  currentTime: 0,
  setCurrentTime: (time) => set({ currentTime: time }),
  duration: 0,
  setDuration: (duration) => set({ duration: duration }),
  playbackRate: 1,
  setPlaybackRate: (rate) => set({ playbackRate: rate }),
  activeAudioSurah: null,
  setActiveAudioSurah: (surah) => set({ activeAudioSurah: surah }),
  activeAudioAyah: null,
  setActiveAudioAyah: (ayah) => set({ activeAudioAyah: ayah }),
  activeAudioWord: null,
  setActiveAudioWord: (word) => set({ activeAudioWord: word }),
  audioData: null,
  setAudioData: (data) => set({ audioData: data }),
}));
