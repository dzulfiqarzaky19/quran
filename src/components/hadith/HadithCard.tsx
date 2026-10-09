import Link from "next/link";

interface HadithCardProps {
  number: number;
  text: string;
  arabic?: string;
  // Search results link to the hadith inside its book
  href?: string;
}

export const HadithCard = ({ number, text, arabic, href }: HadithCardProps) => (
  <li
    id={`h-${number}`}
    className="flex scroll-mt-32 flex-col gap-6 rounded-2xl bg-surface-container-low p-5 sm:p-6"
  >
    <p className="text-label-sm font-medium uppercase tabular-nums tracking-[0.05em] text-primary">
      Hadith {number}
    </p>

    {arabic && (
      <p className="font-arabic text-[1.75rem] leading-[2.2] text-on-surface" dir="rtl" lang="ar">
        {arabic}
      </p>
    )}

    {text && <p className="text-body-lg text-on-surface-variant">{text}</p>}

    {href && (
      <Link
        href={href}
        className="flex h-11 items-center self-start rounded-xl text-body-sm font-semibold text-primary transition-colors hover:text-on-surface active:scale-[0.98]"
      >
        Read with Arabic
      </Link>
    )}
  </li>
);
