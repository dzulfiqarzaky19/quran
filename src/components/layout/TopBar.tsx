'use client';

import Link from 'next/link';
import { SearchInput } from '../ui/SearchInput';
import { useAppStore } from '@/store';

export function TopBar() {
  const { searchQuery, setSearchQuery } = useAppStore();

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-outline-variant/15">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
        <Link href="/" className="text-body-lg font-bold tracking-[0.05em] text-primary">
          AL-QURAN
        </Link>
        <div className="flex-1 flex justify-center">
          <SearchInput 
            placeholder="Search Surah..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant cursor-pointer hover:bg-surface-container-high transition-colors">
          {/* Settings Icon Placeholder */}
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </div>
      </div>
    </header>
  );
}
