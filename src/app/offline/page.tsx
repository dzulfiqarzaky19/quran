import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline | AL-QURAN",
};

// Served by the service worker when a page that was never opened is requested offline
export default function OfflinePage() {
  return (
    <div className="mx-auto w-full max-w-xl px-3">
      <h1 className="text-title-lg font-bold tracking-tight">You are offline</h1>
      <p className="mt-2 text-body-lg text-on-surface-variant">
        This page has not been saved on this device yet. Pages you have already opened, along with
        prayer times, tasbih and the Hijri calendar, still work without a connection.
      </p>
    </div>
  );
}
