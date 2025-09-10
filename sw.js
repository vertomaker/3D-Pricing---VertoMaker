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
// ... (restante do código)
