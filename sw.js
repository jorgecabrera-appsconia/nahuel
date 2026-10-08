const CACHE_NAME = 'caida-tension-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './cuadernillo.html',
  './presentacion.html',
  './css/styles.css',
  './js/app.js',
  './images/transformador.jpg',
  './manifest.json',
  './images/icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .catch((err) => console.log('Error caching assets', err))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
