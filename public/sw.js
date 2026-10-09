// Offline support. Hand-written because the app has no build step for workers:
// hashed build assets are cached on first use, pages are served from the network
// and kept as a fallback, so anything opened once can be opened again offline.

const CACHE = 'quran-v1';
const OFFLINE_URL = '/offline';
const SHELL = ['/', '/dzikir', '/dzikir/daily', '/tasbih', '/prayer', '/hijri', '/hifz', '/hadith', '/zakat', '/reading', OFFLINE_URL];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      // Best effort: one page failing must not block the install
      .then((cache) => Promise.allSettled(SHELL.map((url) => cache.add(url))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

const cacheFirst = async (request) => {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
};

const networkFirst = async (request) => {
  const cache = await caches.open(CACHE);
  const isNavigation = request.mode === 'navigate';

  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request, { ignoreVary: true });
    if (cached) return cached;
    // A failed data request makes the router fall back to a full page load, which lands here
    if (!isNavigation) return Response.error();
    // Search params only filter a page on the client, so the bare page will do. Matching
    // by path rather than ignoring the search keeps the router's ?_rsc payloads out.
    const page = await cache.match(new URL(request.url).pathname);
    return page ?? (await cache.match(OFFLINE_URL)) ?? Response.error();
  }
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  // Third-party APIs and audio are left to the browser
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Build assets carry a content hash, so a cached copy never goes stale
  event.respondWith(
    url.pathname.startsWith('/_next/static/') ? cacheFirst(request) : networkFirst(request),
  );
});
