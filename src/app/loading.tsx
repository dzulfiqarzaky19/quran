export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col animate-pulse">
      <div className="mb-6 flex items-baseline justify-between gap-4 px-3">
        <div className="h-8 w-28 bg-surface-container-highest rounded-xl" />
        <div className="h-4 w-20 bg-surface-container-high rounded-lg" />
      </div>

      <div className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-x-8">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="h-16 bg-surface-container-low rounded-xl" />
        ))}
      </div>
    </div>
  );
}
