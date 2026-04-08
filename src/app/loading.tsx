export default function Loading() {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="mb-16 mt-8">
        <div className="h-16 w-64 bg-surface-container-highest rounded-2xl mx-auto mb-4" />
        <div className="h-6 w-96 bg-surface-container-high rounded-xl mx-auto" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="h-44 bg-surface-container-low rounded-2xl border border-outline-variant/15" />
        ))}
      </div>
    </div>
  );
}
