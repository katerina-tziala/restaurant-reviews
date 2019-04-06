//cache names
const staticCacheName = 'rr-files-v1';
const imagesCacheName = 'rr-images-v1';
const appCaches = [staticCacheName, imagesCacheName];
//files to be cached
const cacheFiles = [_APP_CACHE_FILES_];
/*
const cacheFiles = [
  '/',
  'index.html',
  'restaurant.html',
  'js/app.js',
  'js/dbhelper.js',
  'js/fileLoader.js',
  'js/index.js',
  'js/interface_manager.js',
  'js/map.js',
  'js/notifications.js',
  'js/restaurant.js',
  'js/select_widget.js',
  'js/variables.js',
  'css/critical.css',
  'css/index.css',
  'css/map.css',
  'css/no_results_message.css',
  'css/notifications.css',
  'css/restaurant.css',
  'css/reviews.css',
  'css/select_widget.css'
];
*/
//images to be cached
const cacheImages = [
  'favicon.ico',
  'mstile-70x70.png',
  'mstile-150x150.png',
  'mstile-310x150.png',
  'mstile-310x310.png',
  'img/1.jpg',
  'img/2.jpg',
  'img/3.jpg',
  'img/4.jpg',
  'img/5.jpg',
  'img/6.jpg',
  'img/7.jpg',
  'img/8.jpg',
  'img/9.jpg',
  'img/10.jpg',
  'img/android-chrome-64x64.png',
  'img/android-chrome-128x128.png',
  'img/android-chrome-192x192.png',
  'img/android-chrome-256x256.png',
  'img/android-chrome-512x512.png',
  'img/apple-touch-icon-57x57.png',
  'img/apple-touch-icon-76x76.png',
  'img/apple-touch-icon-144x144.png',
  'img/apple-touch-icon-152x152.png',
  'img/apple-touch-icon.png',
  'img/safari-pinned-tab.svg'
];

//Install Service Worker and cache files:
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      return cache.addAll(cacheFiles);
    })
  );
  event.waitUntil(
    caches.open(imagesCacheName).then((cache) => {
      return cache.addAll(cacheImages);
    })
  );
});

//Activate Service Worker and delete old cache(s):
self.addEventListener('activate', (event) => {
  self.clients.claim();
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName.startsWith('rr-') && !appCaches.includes(cacheName);
        }).map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

//Activate a waiting Service Worker:
self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

//Respond with a file from cache or add the requested file in cache and then respond:
//Handle API requests as well:
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  const requestedPath = requestUrl.pathname;
  if (requestedPath.startsWith('/restaurants')) {
    return;
  }
  if (requestedPath.match('.jpg') || requestedPath.match('.png') || requestedPath.match('.svg') || requestedPath.match('.ico')) {
    event.respondWith(retrieveFile(imagesCacheName, event.request));
    return;
  }
  event.respondWith(retrieveFile(staticCacheName, event.request));
});

//Respond with an image or file from cache or add the requested image or file in cache and then respond:
self.retrieveFile = (cache, request) =>{
  return caches.open(cache).then((cache) => {
    return cache.match(request).then((response) => {
      // Cache hit - return response:
      if (response) {
        return response;
      }
      // Not cache hit:
      return fetch(request).then((networkResponse) => {
        cache.put(request, networkResponse.clone());
        return networkResponse;
      });
      return fetch(request);
    }).catch((error) => {
      const requestUrl = new URL(request.url);
      const requestedPath = requestUrl.href;
      if (requestedPath.match("id=")) {
        return cache.match('restaurant.html');
      }
    })
  });
};
