import Link from 'next/link';
import { SearchInput } from '../ui/SearchInput';
import { Suspense } from 'react';
import { Settings2 } from 'lucide-react';

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-outline-variant/15">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
        <Link href="/" className="text-body-lg font-bold tracking-[0.05em] text-primary">
          AL-QURAN
        </Link>
        <div className="flex-1 flex justify-center">
          <Suspense fallback={<div className="relative w-full max-w-md h-[46px] bg-surface-container-highest rounded-xl animate-pulse" />}>
            <SearchInput placeholder="Search Surah..." />
          </Suspense>
        </div>
        <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant cursor-pointer hover:bg-surface-container-high transition-colors">
          <Settings2 className="w-5 h-5" />
        </div>
      </div>
    </header>
  );
}

