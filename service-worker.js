self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open('duo-alarm-v1').then((cache) => {
            return cache.addAll([
                './',
                './index.html',
                './manifest.json',
                './icon-192.jpg',
                './icon-512.jpg'
            ]);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
});