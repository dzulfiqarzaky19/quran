import Link from 'next/link';
import { SearchInput } from '../ui/SearchInput';
import { Suspense } from 'react';
import { SettingsButton } from './SettingsButton';

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
        <SettingsButton />
      </div>
    </header>
  );
}

