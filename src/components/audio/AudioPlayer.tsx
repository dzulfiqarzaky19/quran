"use client";

import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/store";
import { fetchAudioSegments } from "@/lib/api";
import { useAudioSync } from "@/hooks/useAudioSync";
import { useShallow } from "zustand/react/shallow";

interface AudioPlayerProps {
  surahNo: number;
  reciterId: number;
}

export function AudioPlayer({ surahNo, reciterId }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [duration, setDuration] = useState(0);

  // Global state for slow-updating elements
  const {
    isPlaying,
    activeAudioAyah,
    audioData,
    setIsPlaying,
    setAudioData,
  } = useAppStore(
    useShallow((state) => ({
      isPlaying: state.isPlaying,
      activeAudioAyah: state.activeAudioAyah,
      audioData: state.audioData,
      setIsPlaying: state.setIsPlaying,
      setAudioData: state.setAudioData,
    })),
  );

  const { localTime, onTimeUpdate, handleSeek, jumpToAyah } = useAudioSync(
    audioRef,
    audioData,
  );

  // Load audio metadata and Tajweed data
  useEffect(() => {
    async function loadResources() {
      try {
        const audio = await fetchAudioSegments(surahNo, reciterId);

        setAudioData(audio);
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to load resources:", error);
      }
    }
    loadResources();
  }, [surahNo, reciterId, setAudioData]);

  useEffect(() => {
    if (!audioRef.current || !isLoaded) return;

    audioRef.current.playbackRate = playbackRate;

    if (isPlaying) {
      audioRef.current.play().catch(console.error);
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, isLoaded, playbackRate]);


  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleNext = () => {
    if (!activeAudioAyah) return;
    const success = jumpToAyah(activeAudioAyah + 1, surahNo);
    if (success) setIsPlaying(true);
  };

  const handlePrev = () => {
    if (!activeAudioAyah) return;
    const success = jumpToAyah(activeAudioAyah - 1, surahNo);
    if (success) setIsPlaying(true);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!audioData) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 glass pb-[env(safe-area-inset-bottom)]">
      <input
        type="range"
        aria-label="Seek"
        min={0}
        max={duration || 100}
        step={0.1}
        value={localTime}
        onChange={handleSeek}
        className="block"
      />

      <div className="max-w-3xl mx-auto h-14 px-2 flex items-center gap-1">
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="w-11 h-11 shrink-0 rounded-xl bg-primary text-surface flex items-center justify-center active:scale-[0.98] transition-transform"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>

        <div className="flex-1 min-w-0 px-2">
          <p className="text-body-sm font-semibold text-on-surface truncate">
            {activeAudioAyah ? `Ayah ${activeAudioAyah}` : "Recitation"}
          </p>
          <p className="text-label-sm text-on-surface-variant">
            {formatTime(localTime)} / {formatTime(duration)}
          </p>
        </div>

        <button
          onClick={handlePrev}
          disabled={!activeAudioAyah || activeAudioAyah <= 1}
          aria-label="Previous ayah"
          className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors disabled:opacity-30 disabled:hover:text-on-surface-variant"
        >
          <SkipBack className="w-5 h-5 fill-current" />
        </button>
        <button
          onClick={handleNext}
          disabled={
            !activeAudioAyah ||
            !audioData ||
            activeAudioAyah >= audioData.audio_file.timestamps.length
          }
          aria-label="Next ayah"
          className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors disabled:opacity-30 disabled:hover:text-on-surface-variant"
        >
          <SkipForward className="w-5 h-5 fill-current" />
        </button>
        <button
          onClick={() =>
            setPlaybackRate(playbackRate >= 2 ? 0.5 : playbackRate + 0.5)
          }
          aria-label="Playback speed"
          className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-label-sm font-bold text-primary hover:bg-surface-container-high transition-colors"
        >
          {playbackRate}x
        </button>
      </div>

      <audio
        ref={audioRef}
        src={audioData.audio_file.audio_url}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={() => {
          if (
            activeAudioAyah &&
            audioData &&
            activeAudioAyah < audioData.audio_file.timestamps.length
          ) {
            handleNext();
          } else {
            setIsPlaying(false);
          }
        }}
      />
    </div>
  );
}
