// Versão 1.7
self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open("calc3d-store").then((cache) => {
            return cache.addAll([
                "index.html",
                "script.js",
                "manifest.json",
                "icons/icon-192.png", // Verifique se essa linha está aqui!
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

