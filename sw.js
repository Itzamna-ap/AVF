const CACHE_NAME = 'advance-fertilizer-cache-v5'; // Updated version to force refresh
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
  // We will no longer cache external CDN assets as they cause CORS issues.
  // The browser will handle caching them.
];

// Install event: caches core assets of our app.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching core local assets');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event: removes old caches to keep the app updated.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: Defines how to handle requests.
self.addEventListener('fetch', event => {
  // Strategy: Network Only for API calls.
  // This ensures data is always fresh and avoids CORS issues with POST requests.
  if (event.request.url.includes('script.google.com')) {
    // Do not intercept API calls. Let the browser handle it.
    return;
  }

  // Strategy: Cache First, then Network for local assets.
  // This makes the app load fast.
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // If the resource is in the cache, return it.
        if (cachedResponse) {
          return cachedResponse;
        }
        // Otherwise, fetch it from the network. The browser will handle CDN caching.
        return fetch(event.request);
      })
  );
});
