// Nome do cache principal, atualize para forçar a nova versão
const CACHE_NAME = 'calc3d-store-v3.0';

// Lista de arquivos essenciais que serão pré-armazenados em cache
const urlsToCache = [
    '/',
    'index.html',
    'script.js',
    'manifest.json',
    'image/logopdf.png',
    'icons/icon-512.png'
];

// O evento 'install' é acionado quando o service worker é instalado.
// Ele armazena os arquivos essenciais no cache.
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('Cache principal aberto!');
            return cache.addAll(urlsToCache);
        })
    );
});

// O evento 'fetch' intercepta todas as requisições de rede.
// Ele tenta encontrar o recurso no cache primeiro.
// Se não encontrar, ele busca o recurso na rede e o salva no cache dinâmico.
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request)
        .then((response) => {
            // Se o recurso estiver no cache, retorna a resposta do cache.
            if (response) {
                return response;
            }

            // Se não estiver no cache, busca o recurso na rede.
            return fetch(e.request)
                .then((response) => {
                    // Verifica se a resposta é válida antes de clonar.
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clona a resposta para que ela possa ser usada no cache e no navegador.
                    const responseToCache = response.clone();

                    // Salva a nova resposta no cache dinâmico.
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(e.request, responseToCache);
                        });

                    // Retorna a resposta para o navegador.
                    return response;
                });
        })
    );
});

// O evento 'activate' é acionado quando o service worker é ativado.
// Ele limpa versões antigas do cache para não ocupar espaço desnecessário.
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys()
        .then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((cacheName) => {
                    // Retorna os caches que são diferentes do nome atual.
                    return cacheName !== CACHE_NAME;
                }).map((cacheName) => {
                    // Deleta os caches antigos.
                    console.log('Deletando cache antigo:', cacheName);
                    return caches.delete(cacheName);
                })
            );
        })
    );
});
