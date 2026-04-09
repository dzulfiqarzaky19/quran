"use client";

import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/store";
import { fetchAudioSegments, fetchSurahTajweed } from "@/lib/api";
import { useAudioSync } from "@/hooks/useAudioSync";
import { useShallow } from "zustand/react/shallow";

interface AudioPlayerProps {
  surahNo: number;
}

export function AudioPlayer({ surahNo }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Global state for slow-updating elements
  const {
    isPlaying,
    duration,
    playbackRate,
    activeAudioAyah,
    audioData,
    setIsPlaying,
    setDuration,
    setPlaybackRate,
    setAudioData,
    setActiveAudioSurah,
    setTajweedData,
  } = useAppStore(
    useShallow((state) => ({
      isPlaying: state.isPlaying,
      duration: state.duration,
      playbackRate: state.playbackRate,
      activeAudioAyah: state.activeAudioAyah,
      audioData: state.audioData,
      setIsPlaying: state.setIsPlaying,
      setDuration: state.setDuration,
      setPlaybackRate: state.setPlaybackRate,
      setAudioData: state.setAudioData,
      setActiveAudioSurah: state.setActiveAudioSurah,
      setTajweedData: state.setTajweedData,
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
        const [audio, tajweed] = await Promise.all([
          fetchAudioSegments(surahNo),
          fetchSurahTajweed(surahNo),
        ]);
        setAudioData(audio);
        setTajweedData(tajweed);
        setActiveAudioSurah(surahNo);
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to load resources:", error);
      }
    }
    loadResources();
  }, [surahNo, setAudioData, setTajweedData, setActiveAudioSurah]);

  useEffect(() => {
    if (!audioRef.current || !isLoaded) return;

    audioRef.current.playbackRate = playbackRate;

    if (isPlaying) {
      audioRef.current.play().catch(console.error);
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, isLoaded, playbackRate]);

  // Auto-scroll to active ayah
  useEffect(() => {
    if (activeAudioAyah && isPlaying) {
      const element = document.getElementById(`verse-${activeAudioAyah}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [activeAudioAyah, isPlaying]);

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
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 md:pb-6 pointer-events-none">
      <div className="max-w-4xl mx-auto glass rounded-3xl p-4 md:p-6 shadow-2xl border border-outline-variant/20 pointer-events-auto flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <span className="text-label-sm text-on-surface-variant w-10">
            {formatTime(localTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={localTime}
            onChange={handleSeek}
            className="flex-1"
          />
          <span className="text-label-sm text-on-surface-variant w-10">
            {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() =>
                setPlaybackRate(playbackRate >= 2 ? 0.5 : playbackRate + 0.5)
              }
              className="px-3 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-bright text-label-sm font-bold text-primary transition-colors"
            >
              {playbackRate}x
            </button>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <button
              onClick={handlePrev}
              disabled={!activeAudioAyah || activeAudioAyah <= 1}
              className="text-on-surface-variant hover:text-primary transition-colors disabled:opacity-30 disabled:hover:text-on-surface-variant"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18V6h2v12H6zm3.5-6L18 18V6l-8.5 6z" />
              </svg>
            </button>
            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-primary text-surface flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              {isPlaying ? (
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg
                  className="w-8 h-8 ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <button
              onClick={handleNext}
              disabled={
                !activeAudioAyah ||
                !audioData ||
                activeAudioAyah >= audioData.audio_file.timestamps.length
              }
              className="text-on-surface-variant hover:text-primary transition-colors disabled:opacity-30 disabled:hover:text-on-surface-variant"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 18V6h-2v12h2zM7 6v12l8.5-6L7 6z" />
              </svg>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className="text-label-sm text-on-surface-variant leading-none mb-1 uppercase tracking-widest">
                Playing Ayah
              </p>
              <p className="text-body-sm font-bold text-primary">
                {activeAudioAyah || "-"}
              </p>
            </div>
          </div>
        </div>
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
