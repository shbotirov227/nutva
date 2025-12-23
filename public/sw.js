/* ================================
   Nutva Service Worker (PROD)
   ================================ */

const CACHE_NAME = 'nutva-v1.1.2';

// Faqat 100% mavjud bo‘lishi shart bo‘lgan assetlar
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
];

/* ================================
   INSTALL
   ================================ */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      // Bitta asset 404 bo‘lsa ham SW yiqilmasin
      Promise.allSettled(
        STATIC_ASSETS.map((asset) => cache.add(asset))
      )
    )
  );

  self.skipWaiting();
});

/* ================================
   ACTIVATE
   ================================ */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );

  self.clients.claim();
});

/* ================================
   FETCH
   ================================ */
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Faqat GET requestlar
  if (request.method !== 'GET') {
    event.respondWith(fetch(request));
    return;
  }

  // Next.js build assetlarini HECH QACHON cache qilma
  if (request.url.includes('/_next/')) {
    event.respondWith(fetch(request));
    return;
  }

  // API — network first (cache optional fallback)
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // xohlasang cache qilish mumkin
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Rasmlar — cache first
  if (
    request.destination === 'image' ||
    request.url.match(/\.(webp|png|jpg|jpeg|svg)$/)
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;

          return fetch(request).then((response) => {
            if (response.ok) {
              cache.put(request, response.clone());
            }
            return response;
          });
        })
      )
    );
    return;
  }

  // Boshqa sahifalar — stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request).then((response) => {
        if (response.ok) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, response.clone());
          });
        }
        return response;
      });

      return cached || networkFetch;
    })
  );
});
