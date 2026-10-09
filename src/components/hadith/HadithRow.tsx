import Link from "next/link";

interface HadithRowProps {
  href: string;
  index: number;
  title: string;
  subtitle: string;
}

export const HadithRow = ({ href, index, title, subtitle }: HadithRowProps) => (
  <Link
    href={href}
    className="flex min-h-16 items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-surface-container-low active:scale-[0.98] active:bg-surface-container-high"
  >
    <span className="w-8 shrink-0 text-label-sm font-medium tabular-nums tracking-[0.05em] text-primary">
      {index}
    </span>
    <span className="min-w-0 flex-1">
      <span className="block text-body-lg font-semibold text-on-surface">{title}</span>
      <span className="block text-body-sm text-on-surface-variant">{subtitle}</span>
    </span>
  </Link>
);
