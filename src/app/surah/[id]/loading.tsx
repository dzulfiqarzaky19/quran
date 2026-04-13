import React from "react";

export default function SurahLoading() {
  return (
    <div className="flex flex-col animate-pulse">
      {/* Header Skeleton */}
      <div className="w-full h-48 bg-surface-container rounded-3xl mb-8" />

      {/* Progress Bar Skeleton */}
      <div className="mb-4 text-center">
        <div className="h-1 w-full max-w-2xl mx-auto rounded-full bg-surface-container overflow-hidden" />
        <div className="h-4 w-20 bg-surface-container mx-auto mt-4 rounded" />
      </div>

      {/* Verse List Skeleton */}
      <div className="mt-8 space-y-6 md:space-y-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-full h-64 bg-surface-container rounded-3xl p-8">
            <div className="flex justify-between mb-8">
              <div className="h-4 w-12 bg-surface-container-high rounded" />
              <div className="flex gap-2">
                <div className="h-10 w-10 bg-surface-container-high rounded-xl" />
                <div className="h-10 w-10 bg-surface-container-high rounded-xl" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-surface-container-high rounded ml-auto" />
              <div className="h-6 w-full bg-surface-container-high rounded" />
              <div className="h-6 w-2/3 bg-surface-container-high rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
