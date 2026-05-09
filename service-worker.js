let alarmTimer = null;

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open('duo-alarm-v1').then((cache) => {
            return cache.addAll([
                './',
                './index.html',
                './manifest.json',
                './icon-192.png',
                './icon-512.png'
            ]);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

const STATIC_ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './duo-happy-jpg.jpg', './duo-think-jpeg.jpeg', './duo-sad-webp.webp'];

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    // Netlify 함수는 항상 네트워크에서 가져옴
    if (url.pathname.startsWith('/.netlify/')) {
        event.respondWith(fetch(event.request));
        return;
    }
    // 정적 파일은 캐시 우선, 없으면 네트워크
    event.respondWith(
        caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
            if (response.ok && STATIC_ASSETS.some(a => url.pathname.endsWith(a.replace('./', '/')))) {
                const clone = response.clone();
                caches.open('duo-alarm-v1').then(c => c.put(event.request, clone));
            }
            return response;
        }))
    );
});

self.addEventListener('message', (event) => {
    if (event.data.type === 'SET_ALARM') {
        const { alarmTime } = event.data;
        if (alarmTimer) clearTimeout(alarmTimer);
        const delay = alarmTime - Date.now();
        if (delay <= 0) return;
        alarmTimer = setTimeout(async () => {
            alarmTimer = null;
            const clientList = await clients.matchAll({ type: 'window', includeUncontrolled: true });
            clientList.forEach(client => client.postMessage({ type: 'ALARM_FIRED' }));
            self.registration.showNotification('⏰ 알람!', {
                body: '듀오링고를 완료하고 알람을 꺼주세요!',
                icon: './icon-192.png',
                vibrate: [500, 200, 500, 200, 500, 200, 500],
                requireInteraction: true,
                tag: 'duo-alarm'
            });
        }, delay);
    } else if (event.data.type === 'CANCEL_ALARM') {
        if (alarmTimer) { clearTimeout(alarmTimer); alarmTimer = null; }
    }
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if ('focus' in client) {
                    client.postMessage({ type: 'ALARM_FIRED' });
                    return client.focus();
                }
            }
            return clients.openWindow('/?alarm=true');
        })
    );
});
