import React from "react";

export default function SurahLoading() {
  return (
    <div className="mx-auto flex min-h-[100svh] w-full max-w-2xl animate-pulse flex-col items-center justify-center gap-4 py-24">
      {/* Title screen skeleton */}
      <div className="h-12 w-40 rounded-xl bg-surface-container" />
      <div className="h-14 w-64 max-w-full rounded-xl bg-surface-container" />
      <div className="h-5 w-32 rounded bg-surface-container" />
      <div className="h-4 w-40 rounded bg-surface-container" />
    </div>
  );
}
