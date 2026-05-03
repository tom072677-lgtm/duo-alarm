self.addEventListener('install', function(e) {
    console.log('Service Worker 설치됨');
});

self.addEventListener('activate', function(e) {
    console.log('Service Worker 활성화됨');
});

self.addEventListener('fetch', function(e) {
    e.respondWith(fetch(e.request));
});