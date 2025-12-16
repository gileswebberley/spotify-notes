import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';

// Precache injected manifest plus explicit files
// precacheAndRoute(
//   (self.__WB_MANIFEST || []).concat([
//     // { url: '/manifest.webmanifest', revision: null },
//     { url: '/offline.html', revision: null },
//   ])
// );
precacheAndRoute(self.__WB_MANIFEST || []);

// take control of the page as soon as possible
self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('Service worker installed');
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.registration.navigationPreload?.enable());
  event.waitUntil(self.clients.claim());
  console.log('Service worker activated and claimed clients');
});

// network-first navigation handler; fallback to offline.html on failure
registerRoute(
  ({ request }) => request.mode === 'navigate',
  async ({ request }) => {
    try {
      const preloadResponse =
        await self.registration.navigationPreload?.getResponse?.();
      if (preloadResponse) return preloadResponse;

      const response = await fetch(request);

      // treat non-OK responses as failure so we fall back
      if (response && response.ok) return response;
      throw new Error(
        `Network response not OK: ${response && response.status}`
      );
    } catch (err) {
      console.log('Navigation fetch failed, returning offline fallback', err);
      const fallback = await caches.match('/offline.html');
      if (fallback) return fallback;
      return new Response(
        '<h1>Offline</h1><p>No cached fallback available.</p>',
        {
          headers: { 'Content-Type': 'text/html' },
          status: 503,
        }
      );
    }
  }
);
