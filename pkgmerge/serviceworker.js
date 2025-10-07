const cacheName = "pkgmerge-static-v3";

const contentToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/pkgmerge-32.png",
  "./icons/pkgmerge-64.png",
  "./icons/pkgmerge-128.png",
  "./icons/pkgmerge-256.png",
];

self.addEventListener('fetch', function (e) {
  e.respondWith(
    (async () => {
      const r = await caches.match(e.request);
      if (r) {
        return r;
      }
      const response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      cache.put(e.request, response.clone());
      return response;
    })()
  );
});

self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      await cache.addAll(contentToCache);
    })()
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key === cacheName) {
            return;
          }
          return caches.delete(key);
        })
      );
    })
  );
});

self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    console.log("received skipWaiting message");
    skipWaiting();
  }
});