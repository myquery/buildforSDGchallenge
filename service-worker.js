// Set a name for the current cache
const cacheName = 'v1';

// Default files to always cache
const cacheFiles = [
  './',
  './src/index.html',
  './js/app.js',
  './css/reset.css',
  './css/style.css',
  'https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700,400italic,700italic'
];

// eslint-disable-next-line no-restricted-globals
self.addEventListener('install', (e) => {
  console.log('[ServiceWorker] Installed');

  // e.waitUntil Delays the event until the Promise is resolved
  e.waitUntil(
    // eslint-disable-next-line no-tabs
    // Open the cache
    caches.open(cacheName).then((cache) => {
      // Add all the default files to the cache
      console.log('[ServiceWorker] Caching cacheFiles');
      return cache.addAll(cacheFiles);
    })
  ); // end e.waitUntil
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener('activate', (e) => {
  console.log('[ServiceWorker] Activated');

  e.waitUntil(
    // Get all the cache keys (cacheName)
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames.map((thisCacheName) => {
        // If a cached item is saved under a previous cacheName
        if (thisCacheName !== cacheName) {
          // Delete that cached file
          console.log(
            '[ServiceWorker] Removing Cached Files from Cache - ',
            thisCacheName
          );
          return caches.delete(thisCacheName);
        }
      })
    ))
  ); // end e.waitUntil
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener('fetch', (e) => {
  console.log('[ServiceWorker] Fetch', e.request.url);

  // e.respondWidth Responds to the fetch event
  e.respondWith(
    // Check in cache for the request being made
    caches
      .match(e.request)
      .then((response) => {
        // If the request is in the cache
        if (response) {
          console.log(
            '[ServiceWorker] Found in Cache',
            e.request.url,
            response
          );
          // Return the cached version
          return response;
        }

        // If the request is NOT in the cache, fetch and cache

        const requestClone = e.request.clone();
        fetch(requestClone)
          .then((response) => {
            if (!response) {
              console.log('[ServiceWorker] No response from fetch ');
              return response;
            }

            const responseClone = response.clone();

            //  Open the cache
            caches.open(cacheName).then((cache) => {
              // Put the fetched response in the cache
              cache.put(e.request, responseClone);
              console.log('[ServiceWorker] New Data Cached', e.request.url);

              // Return the response
              return response;
            }); // end caches.open
          })
          .catch((err) => {
            console.log(
              '[ServiceWorker] Error Fetching & Caching New Data',
              err
            );
          });
      }) // end caches.match(e.request)
  ); // end e.respondWith
});
