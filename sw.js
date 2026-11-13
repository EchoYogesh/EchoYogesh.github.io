/* ============================================================
   Service Worker for Brijesh & Sangeeta Wedding App
   Offline-First PWA Cache & Village Low-Connectivity Strategy
   ============================================================ */

const CACHE_NAME = 'brijesh-sangeeta-v1.0';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Install: Cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up old versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Stale-While-Revalidate with Navigation Fallback
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Non-GET requests (e.g. POST) pass directly to network
  if (req.method !== 'GET') return;

  // Handle navigation requests (page loads)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then((networkRes) => {
        // Cache the fresh HTML
        if (networkRes.ok) {
          const resClone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
        }
        return networkRes;
      }).catch(() => {
        // Offline fallback to cached index.html
        return caches.match('./index.html').then((cached) => cached || caches.match('./'));
      })
    );
    return;
  }

  // Google Fonts or static external styles/fonts
  if (url.origin.includes('fonts.googleapis.com') || url.origin.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(req).then((cachedRes) => {
          const fetchPromise = fetch(req).then((networkRes) => {
            if (networkRes.ok) cache.put(req, networkRes.clone());
            return networkRes;
          }).catch(() => cachedRes);
          return cachedRes || fetchPromise;
        });
      })
    );
    return;
  }

  // Same-origin assets: Stale-While-Revalidate
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(req).then((cachedRes) => {
        const fetchPromise = fetch(req).then((networkRes) => {
          if (networkRes.ok) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        }).catch(() => cachedRes);

        return cachedRes || fetchPromise;
      })
    );
  }
});

