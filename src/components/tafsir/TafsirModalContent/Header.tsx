import { X } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  surah: number;
  ayah: number;
}

export const Header = ({ surah, ayah }: HeaderProps) => {
  return (
    <div className="flex flex-col shrink-0 border-b border-outline-variant/15 p-4 md:px-6 bg-surface-container/30">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-title-sm font-bold text-on-surface">
            Surah {surah}, Ayah {ayah}
          </h2>
          <p className="text-label-sm text-on-surface-variant mt-1">
            Quranic Verse • Meaning and Reflection
          </p>
        </div>
        <Link
          href="?"
          scroll={false}
          replace
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};
