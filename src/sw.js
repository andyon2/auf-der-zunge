// Service worker: caches the whole built game so it runs offline after one visit.
// vite.config.ts fills in VERSION (hash of the build) and FILES (every built file) when building.
const CACHE = 'adz-__VERSION__';
const FILES = __FILES__;

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});

// Drop caches of older builds.
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('adz-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Pages: network first, so a new build shows up; offline the cached page. Everything else: cache first.
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(() => caches.match('./', { ignoreSearch: true })));
    return;
  }
  event.respondWith(caches.match(req, { ignoreSearch: true, ignoreVary: true }).then(hit => hit ?? fetch(req)));
});
