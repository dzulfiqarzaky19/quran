"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center text-error border border-error/20 mb-2">
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h2 className="text-display-sm font-bold text-on-surface">
        Connection Interrupted
      </h2>
      <p className="text-body-lg text-on-surface-variant max-w-md mx-auto">
        We encountered a problem while retrieving the Surah library from the server.
        The connection might have timed out or failed.
      </p>

      <button
        onClick={() => reset()}
        className="mt-4 px-8 py-4 bg-primary text-on-primary rounded-xl font-bold tracking-[0.05em] uppercase hover:bg-primary/90 transition-all active:scale-95 shadow-[0_4px_20px_-4px_var(--color-primary)] shadow-primary/30"
      >
        Try Again
      </button>
    </div>
  );
}
