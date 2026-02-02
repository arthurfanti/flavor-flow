const CACHE_NAME = 'flavor-flow-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/icon-192.png',
        '/icon-512.png',
        '/screenshot-mobile.png',
        '/screenshot-desktop.png',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // If a cached response exists, return it
      if (response) {
        return response;
      }

      // Clone the request as it's a stream and can only be consumed once
      const fetchRequest = event.request.clone();

      // Ensure redirects are followed to avoid "redirected response" errors
      return fetch(fetchRequest, { redirect: 'follow' });
    })
  );
});
