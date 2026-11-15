// Bezra offline helper (Field Shift N11). Network first, always: with a connection nothing changes. Without one,
// the last answer saved on this phone is shown (the page shows a "No connection" banner). Sign-out clears it.
const API = 'bezra-api-v1';
const PAGES = 'bezra-pages-v1';
const STATIC = 'bezra-static-v1';
const SKIP = /\/api\/(health|auth\/|demo|chat|jobs\/)/;

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keep = [API, PAGES, STATIC];
    for (const k of await caches.keys()) if (!keep.includes(k)) await caches.delete(k);
    await self.clients.claim();
  })());
});

async function networkFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    else if (res.status >= 500) {            // server waking up or down: the last saved answer beats an empty screen
      const hit = await cache.match(req, { ignoreVary: true });
      if (hit) return hit;
    }
    return res;
  } catch (err) {
    const hit = await cache.match(req, { ignoreVary: true });
    if (hit) return hit;
    throw err;
  }
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) {
    if (SKIP.test(url.pathname)) return;
    e.respondWith(networkFirst(req, API));
  } else if (url.pathname.startsWith('/_next/static/')) {
    e.respondWith(caches.open(STATIC).then(async (c) => (await c.match(req)) || fetch(req).then((r) => { if (r.ok) c.put(req, r.clone()); return r; })));
  } else if (req.mode === 'navigate') {
    e.respondWith(networkFirst(req, PAGES));
  }
});

self.addEventListener('message', (e) => {
  if (e.data === 'clear') e.waitUntil(Promise.all([API, PAGES].map((k) => caches.delete(k))));
});
