"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SearchInput } from '../ui/SearchInput';
import { Suspense } from 'react';

const SECTIONS = [
  { href: '/', label: 'Quran' },
  { href: '/dzikir', label: 'Dzikir' },
  { href: '/tasbih', label: 'Tasbih' },
  { href: '/prayer', label: 'Prayer' },
  { href: '/hijri', label: 'Hijri' },
  { href: '/hifz', label: 'Hifz' },
];

// Only the index pages are searchable
const SEARCH: Record<string, { placeholder: string; label: string }> = {
  '/': { placeholder: 'Search by name or number', label: 'Search surahs' },
  '/dzikir': { placeholder: 'Search topics', label: 'Search dzikir topics' },
};

export function TopBar() {
  const pathname = usePathname();

  // The reading view brings its own slim bar (ReadingBar)
  if (pathname.startsWith('/surah/')) return null;

  const search = SEARCH[pathname];

  return (
    <header className="sticky top-0 z-40 w-full glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Home is an index: search is the header */}
          {search && (
            <div className="h-16 flex items-center [&>div]:max-w-none">
              <Suspense fallback={<div className="w-full h-12 bg-surface-container-highest rounded-xl animate-pulse" />}>
                <SearchInput key={pathname} placeholder={search.placeholder} aria-label={search.label} />
              </Suspense>
            </div>
          )}
          <nav aria-label="Sections" className="flex h-12 items-center overflow-x-auto sm:gap-1">
            {SECTIONS.map(({ href, label }) => {
              const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex h-11 items-center rounded-xl px-2 text-body-sm font-semibold sm:px-3 transition-colors active:scale-[0.98] ${
                    active ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
