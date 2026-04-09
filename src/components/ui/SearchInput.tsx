'use client';

import { Search } from 'lucide-react';
import React from "react";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement>;

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
      <Search
        className="absolute left-4 w-5 h-5 text-on-surface-variant pointer-events-none"
        aria-hidden="true"
      />
      <input
        {...props}
        defaultValue={searchParams.get('q')?.toString() || ''}
        onChange={(e) => handleSearch(e.target.value)}
        className={`w-full bg-surface-container-highest text-on-surface placeholder:text-on-surface-variant pl-12 pr-4 py-3 rounded-xl border border-outline-variant/15 focus:border-primary/40 focus:outline-none transition-all duration-300 ${props.className || ""}`}
      />
    </div>
  );
}
