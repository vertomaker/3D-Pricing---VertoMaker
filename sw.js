// Versão 1.7 (atualize este número a cada alteração no sw.js)
self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open("calc3d-store").then((cache) => {
            return cache.addAll([
                "index.html",
                "script.js",
                "manifest.json",
                "icons/icon-192.png",
                "icons/icon-512.png",
                "logo.png" // Adicione o caminho do seu logo aqui!
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
