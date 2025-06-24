self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('weather-cache').then((cache) => {
      return cache.addAll([
        '/',
        'index.html',
        'style.css',
        'script.js',
        'manifest.json',
        'icons/icon-192.png',
        'icons/icon-512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => {
      return res || fetch(event.request);
    })
  );
});
