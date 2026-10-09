"use client";

import { useEffect } from 'react';

/** Registers the offline service worker. Production only: in dev it would serve stale builds. */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;

    navigator.serviceWorker
      .register('/sw.js', { scope: '/', updateViaCache: 'none' })
      .catch((error: unknown) => {
        // The app works without it, just not offline
        console.error('Service worker registration failed', error);
      });
  }, []);

  return null;
}
