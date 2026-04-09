import { memo } from "react";
import {
  Play,
  Pause,
  Bookmark,
  Copy,
  Share2,
  ExternalLink,
  MoreHorizontal,
} from "lucide-react";
import { useAppStore } from "@/store";
import { useShallow } from "zustand/shallow";

interface VerseHeaderProps {
  surahNo: number;
  ayahNo: number;
}

export const VerseHeader = memo(function VerseHeader({
  surahNo,
  ayahNo,
}: VerseHeaderProps) {
  const { isPlaying, isPlayingAyah } = useAppStore(
    useShallow((state) => {
      const isThisAyah = state.activeAudioAyah === ayahNo;

      return {
        isPlayingAyah: isThisAyah,
        isPlaying: isThisAyah ? state.isPlaying : false,
      };
    }),
  );

  const isActuallyPlaying = isPlayingAyah && isPlaying;

  const audioData = useAppStore((state) => state.audioData);
  const setActiveVerse = useAppStore((state) => state.setActiveVerse);
  const setIsPlaying = useAppStore((state) => state.setIsPlaying);

  const handlePlayFromHere = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioData) return;

    if (isPlayingAyah && isPlaying) {
      setIsPlaying(false);
      return;
    }

    const timestamp = audioData.audio_file.timestamps.find(
      (ts) => ts.verse_key === `${surahNo}:${ayahNo}`,
    );

    if (timestamp) {
      document.dispatchEvent(
        new CustomEvent("audio-seek", {
          detail: timestamp.timestamp_from / 1000,
        }),
      );
      setIsPlaying(true);
      setActiveVerse(ayahNo);
    }
  };

  return (
    <div className="flex items-center justify-between mb-8 group/header">
      <div className="flex items-center gap-4">
        <span className="text-body-sm font-bold tracking-widest text-on-surface-variant/70">
          {surahNo}:{ayahNo}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={handlePlayFromHere}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              isActuallyPlaying
                ? "bg-primary text-surface shadow-lg shadow-primary/20 scale-105"
                : "text-on-surface-variant hover:bg-surface-container-highest hover:text-primary"
            }`}
            title={isActuallyPlaying ? "Pause" : "Play"}
          >
            {isActuallyPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>
          <button className="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest hover:text-primary transition-all">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover/header:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest transition-all">
          <Copy className="w-4 h-4" />
        </button>
        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest transition-all">
          <Share2 className="w-4 h-4" />
        </button>
        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest transition-all">
          <ExternalLink className="w-4 h-4" />
        </button>
        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest transition-all">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});
