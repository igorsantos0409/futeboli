const CACHE = 'futeboli-v1';
const ASSETS = [
  '/futeboli/',
  '/futeboli/index.html',
  '/futeboli/manifest.json',
  '/futeboli/favicon.ico',
  '/futeboli/icon-192.png',
  '/futeboli/icon-512.png',
  '/futeboli/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Supabase e CDN sempre da rede
  if (e.request.url.includes('supabase.co') || e.request.url.includes('cdn.jsdelivr')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
