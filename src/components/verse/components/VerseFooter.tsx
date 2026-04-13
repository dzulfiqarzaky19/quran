import Link from "next/link";

interface VerseFooterProps {
  ayahNo: number;
}

export const VerseFooter = ({ ayahNo }: VerseFooterProps) => (
  <div className="flex flex-wrap gap-6 mt-4 pt-6 border-t border-outline-variant/10">
    <Link
      href={`?tafsir=${ayahNo}`}
      scroll={false}
      className="flex items-center gap-2 text-label-sm font-black tracking-widest text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors uppercase"
    >
      Tafsir
    </Link>
    <button className="flex items-center gap-2 text-label-sm font-black tracking-widest text-on-surface-variant/70 hover:text-on-surface px-3 py-1.5 rounded-lg transition-colors uppercase">
      Pelajaran
    </button>
    <button className="flex items-center gap-2 text-label-sm font-black tracking-widest text-on-surface-variant/70 hover:text-on-surface px-3 py-1.5 rounded-lg transition-colors uppercase">
      Refleksi
    </button>
    <button className="flex items-center gap-2 text-label-sm font-black tracking-widest text-on-surface-variant/70 hover:text-on-surface px-3 py-1.5 rounded-lg transition-colors uppercase ml-auto">
      Jawaban
    </button>
  </div>
);
