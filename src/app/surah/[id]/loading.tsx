export default function Loading() {
  return (
    <div className="flex flex-col animate-pulse">
      {/* Skeleton for SurahHeader */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-surface-container-low rounded-3xl p-8 relative overflow-hidden h-64 border border-outline-variant/15">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full pointer-events-none" />
        </div>
      </div>

      <div className="mb-4 text-center">
        <div className="h-1 w-full max-w-2xl mx-auto rounded-full bg-surface-container overflow-hidden" />
        <div className="text-label-sm tracking-widest text-on-surface-variant uppercase mt-4 h-4 bg-outline-variant/20 w-24 mx-auto rounded-full" />
      </div>

      <div className="mt-8 space-y-6">
        {/* Skeleton for Verse Cards */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="relative w-full rounded-2xl p-6 md:p-8 bg-surface-container h-48" />
        ))}
      </div>
    </div>
  );
}
