// Define a name for the cache
const CACHE_NAME = 'advance-fertilizer-cache-v1';

// List of files to cache using relative paths for GitHub Pages
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
];

// Install event: opens the cache and adds the core files to it.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching core assets');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: serves assets from cache if they exist, otherwise fetches from network.
self.addEventListener('fetch', event => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        // Return response from cache if found.
        if (response) {
          return response;
        }

        // If not in cache, fetch from network.
        return fetch(event.request).then(networkResponse => {
          // Optional: Cache the new resource.
          // IMPORTANT: Do not cache API calls to your Apps Script
          if (networkResponse.ok && !event.request.url.includes('script.google.com')) {
             cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
      });
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
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
