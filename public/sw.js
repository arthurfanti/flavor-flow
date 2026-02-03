const CACHE_NAME = 'flavor-flow-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force this SW to become the active one
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/icon-192.png',
        '/icon-512.png',
        '/screenshot-mobile.png',
        '/screenshot-desktop.png',
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim()); // Take control of all pages immediately
});

self.addEventListener('fetch', (event) => {
  // Navigation requests should be handled by the browser/network directly
  // to allow for proper redirect handling (307/308) from middleware.
  if (event.request.mode === 'navigate') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // If a cached response exists, return it
      if (response) {
        return response;
      }

      return fetch(event.request);
    })
  );
});
