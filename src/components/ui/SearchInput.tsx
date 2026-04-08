'use client';

import React from "react";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'defaultValue'> {}

export function SearchInput(props: SearchInputProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative flex items-center w-full max-w-md">
      <svg
        className="absolute left-4 w-5 h-5 text-on-surface-variant pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        {...props}
        defaultValue={searchParams.get('q')?.toString() || ''}
        onChange={(e) => handleSearch(e.target.value)}
        className={`w-full bg-surface-container-highest text-on-surface placeholder:text-on-surface-variant pl-12 pr-4 py-3 rounded-xl border border-outline-variant/15 focus:border-primary/40 focus:outline-none transition-all duration-300 ${props.className || ""}`}
      />
    </div>
  );
}
