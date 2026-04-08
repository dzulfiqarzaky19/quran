import Link from "next/link";

interface IHeaderProps {
  surah: number;
  ayah: number;
}

export const Header = ({ surah, ayah }: IHeaderProps) => (
  <div className="hidden md:flex flex-col shrink-0 border-b border-outline-variant/15 p-4 bg-surface-container/30">
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-title-lg font-bold text-on-surface">
          Surah {surah}, Ayah {ayah}
        </h2>
        <p className="text-body-sm text-on-surface-variant mt-1">
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
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </Link>
    </div>
  </div>
);
