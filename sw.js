// sw.js
const CACHE_VERSION = 'fromagerie-v1.0.0';
const APP_SHELL = [
  './fromagerie.html',
  './manifest.webmanifest',
  './sw.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_VERSION).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.map(k => (k !== CACHE_VERSION ? caches.delete(k) : null)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (new URL(req.url).origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then(cached =>
        cached ||
        fetch(req).then(res => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then(c => c.put(req, copy));
          return res;
        }).catch(() => caches.match('./fromagerie.html'))
      )
    );
  }
});
