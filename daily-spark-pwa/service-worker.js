// This is a minimal Service Worker file.
// For TWA/Play Store purposes, its main job is to register itself 
// and cache the main files so the app can launch instantly and offline.

const CACHE_NAME = 'daily-spark-cache-v1';
const urlsToCache = [
    // These paths must match the paths in your GitHub repository
    '/index.html',
    '/',
    '/manifest.json'
    // NOTE: You would add your icon images here too (e.g., '/images/icon-192x192.png')
];

// Install event: Caches all required files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // This caches all files in the `urlsToCache` array
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: Serves files from cache first, falling back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // No cache match - proceed to network request
        return fetch(event.request);
      })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
