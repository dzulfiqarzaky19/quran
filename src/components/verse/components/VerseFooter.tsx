import Link from "next/link";
import { VerseHeaderActions } from "./VerseHeaderActions";
import { VerseCopyButton } from "./VerseCopyButton";
import { VerseBookmarkButton } from "./VerseBookmarkButton";
import { VerseMemorizedButton } from "./VerseMemorizedButton";

interface VerseFooterProps {
  surahNo: number;
  ayahNo: number;
  arabic: string;
  translation: string;
}

export const VerseFooter = ({
  surahNo,
  ayahNo,
  arabic,
  translation,
}: VerseFooterProps) => {
  // Translations carry footnote markup; copy plain text only
  const plainTranslation = translation.replace(/<sup[^>]*>.*?<\/sup>/g, "").replace(/<[^>]+>/g, "");
  const copyText = `${arabic}\n\n${plainTranslation}\n(${surahNo}:${ayahNo})`;

  return (
    <div className="flex flex-wrap items-center justify-center gap-1">
      <VerseHeaderActions surahNo={surahNo} ayahNo={ayahNo} />
      <Link
        href={`?tafsir=${ayahNo}`}
        scroll={false}
        className="flex items-center h-11 text-label-sm font-black tracking-widest text-primary hover:bg-primary/5 px-3 rounded-xl transition-colors uppercase active:scale-[0.98]"
      >
        Tafsir
      </Link>
      <VerseCopyButton text={copyText} />
      <VerseBookmarkButton surahNo={surahNo} ayahNo={ayahNo} />
      <VerseMemorizedButton surahNo={surahNo} ayahNo={ayahNo} />
    </div>
  );
};
