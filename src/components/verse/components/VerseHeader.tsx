import {
  Bookmark,
  Copy,
  Share2,
  ExternalLink,
  MoreHorizontal,
} from "lucide-react";
import { VerseHeaderActions } from "./VerseHeaderActions";

interface VerseHeaderProps {
  surahNo: number;
  ayahNo: number;
}

export const VerseHeader = ({ surahNo, ayahNo }: VerseHeaderProps) => (
  <div className="flex items-center justify-between mb-8 group/header">
    <div className="flex items-center gap-4">
      <span className="text-body-sm font-bold tracking-widest text-on-surface-variant/70">
        {surahNo}:{ayahNo}
      </span>
      <div className="flex items-center gap-1">
        <VerseHeaderActions surahNo={surahNo} ayahNo={ayahNo} />
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
