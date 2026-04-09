"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { ChapterAudioResponse } from "@/lib/types";
import { useAppStore } from "@/store";

export function useAudioSync(
  audioRef: React.RefObject<HTMLAudioElement | null>,
  audioData: ChapterAudioResponse | null
) {
  const [localTime, setLocalTime] = useState(0);
  const lastVerseIndex = useRef(0);
  const lastSegmentIndex = useRef(0);

  const {
    setActiveAudioAyah,
    setActiveAudioWord,
  } = useAppStore();

  const onTimeUpdate = useCallback(() => {
    if (!audioRef.current || !audioData) return;

    const currentTime = audioRef.current.currentTime;
    setLocalTime(currentTime);

    const timeMs = currentTime * 1000;
    const timestamps = audioData.audio_file.timestamps;

    let foundAyah = null;
    let foundWord = null;

    let vIndex = lastVerseIndex.current;
    if (timeMs < (timestamps[vIndex]?.timestamp_from || 0) - 1000) vIndex = 0;

    for (let i = vIndex; i < timestamps.length; i++) {
      const ts = timestamps[i];
      if (timeMs >= ts.timestamp_from && timeMs <= ts.timestamp_to) {
        lastVerseIndex.current = i;
        foundAyah = parseInt(ts.verse_key.split(":")[1]);

        if (ts.segments?.length) {
          let sIndex = i === vIndex ? lastSegmentIndex.current : 0;
          if (timeMs < (ts.segments[sIndex]?.[1] || 0)) sIndex = 0;

          for (let j = sIndex; j < ts.segments.length; j++) {
            const [wordIndex, start, end] = ts.segments[j];
            if (timeMs >= start && timeMs <= end) {
              lastSegmentIndex.current = j;
              foundWord = wordIndex;
              break;
            }
          }
        }
        break;
      }
    }

    const state = useAppStore.getState();
    if (foundAyah !== state.activeAudioAyah) {
      setActiveAudioAyah(foundAyah);
    }
    if (foundWord !== state.activeAudioWord) {
      setActiveAudioWord(foundWord);
    }
  }, [audioRef, audioData, setActiveAudioAyah, setActiveAudioWord]);

  // Sync seek events
  useEffect(() => {
    const handleSeekEvent = (e: CustomEvent) => {
      if (audioRef.current) {
        audioRef.current.currentTime = e.detail;
        setLocalTime(e.detail);
      }
    };
    document.addEventListener("audio-seek", handleSeekEvent as EventListener);
    return () =>
      document.removeEventListener(
        "audio-seek",
        handleSeekEvent as EventListener
      );
  }, [audioRef]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setLocalTime(time);
    }
  };

  const jumpToAyah = (ayahNo: number, surahNo: number) => {
    if (!audioData || !audioRef.current) return;
    const timestamp = audioData.audio_file.timestamps.find(
      (ts) => ts.verse_key === `${surahNo}:${ayahNo}`
    );
    if (timestamp) {
      const time = timestamp.timestamp_from / 1000;
      audioRef.current.currentTime = time;
      setLocalTime(time);
      return true;
    }
    return false;
  };

  return {
    localTime,
    onTimeUpdate,
    handleSeek,
    jumpToAyah,
  };
}
