// Versão 2.2 - Para forçar a atualização do cache
self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open("calc3d-store").then((cache) => {
            return cache.addAll([
                "index.html",
                "script.js",
                "manifest.json",
                "icons/icon-192.png",
                "icons/icon-512.png"
            ]);
        })
    );
});

self.addEventListener("fetch", (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
