/**
 * Nombre del cache para la versión actual del service worker.
 * @constant {string}
 */
const CACHE_NAME = 'david-vargas-portfolio-v1';

/**
 * Lista de URLs a cachear durante la instalación del service worker.
 * Incluye páginas, assets y recursos externos necesarios.
 * @constant {string[]}
 */
const urlsToCache = [
    '/',
    '/index.html',
    '/proyectos.html',
    '/sobre-mi.html',
    '/manifest.json',
    '/assets/css/styles.css',
    '/assets/js/i18n.js',
    '/assets/js/script.js',
    '/assets/js/ui.js',
    '/assets/js/theme.js',
    '/assets/js/search.js',
    '/assets/js/utils.js',
    '/assets/js/searchIndex.js',
    '/assets/i18n/es.json',
    '/assets/i18n/en.json',
    '/assets/cv.pdf',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://unpkg.com/lucide@latest'
];

/**
 * Evento de instalación del service worker.
 * Cachea los recursos especificados en urlsToCache.
 */
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
            .catch(err => console.error('Cache addAll failed:', err))
    );
});

/**
 * Evento de fetch del service worker.
 * Implementa estrategia Stale While Revalidate para recursos cacheados.
 */
self.addEventListener('fetch', event => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Handle navigation requests
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    return caches.match('/index.html');
                })
        );
        return;
    }

    // Stale while revalidate for other requests
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                const fetchPromise = fetch(event.request).then(networkResponse => {
                    // Only cache successful responses
                    if (networkResponse.ok) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, responseClone);
                        });
                    }
                    return networkResponse;
                }).catch(() => {
                    // Return cached response if network fails
                    return response;
                });

                // Return cached version immediately, then update cache
                return response || fetchPromise;
            })
    );
});

/**
 * Evento de activación del service worker.
 * Limpia caches antiguos que no coincidan con CACHE_NAME.
 */
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});