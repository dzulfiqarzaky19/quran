"use client";

import { useSearchParams } from "next/navigation";

interface VerseTranslationProps {
  initialText: string;
  translationId: number;
}

export function VerseTranslation({ initialText, translationId }: VerseTranslationProps) {
  const searchParams = useSearchParams();
  const currentTransId = Number(searchParams.get("trans")) || 33;
  
  // We show a skeleton if the URL's translation ID doesn't match the one currently rendered
  const isUpdating = currentTransId !== translationId;

  if (isUpdating) {
    return (
      <div className="space-y-2 mt-4 animate-pulse">
        <div className="h-4 bg-surface-container-high rounded w-full" />
        <div className="h-4 bg-surface-container-high rounded w-2/3" />
      </div>
    );
  }

  return (
    <div 
      className="text-body-md text-on-surface-variant leading-relaxed mt-4"
      dangerouslySetInnerHTML={{ __html: initialText }}
    />
  );
}
