/**
 * Cache name for the current service worker version.
 * Used to uniquely identify cache storage and enable versioning.
 * Update this string on each deployment to invalidate old caches.
 * @constant {string}
 * @example
 * // Usage in cache operations
 * caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache));
 */
const CACHE_NAME = 'david-vargas-portfolio-v1';

/**
 * Array of URLs to cache during service worker installation.
 * Includes essential pages, scripts, styles, fonts, and external resources for offline functionality.
 * @constant {string[]}
 * @typedef {string} CacheUrl - A valid URL string for caching
 * @example
 * // Check if a URL is in the cache list
 * if (urlsToCache.includes(event.request.url)) {
 *   // Handle cached resource
 * }
 * @example
 * // External dependency
 * 'https://cdn.tailwindcss.com' // Tailwind CSS CDN
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
 * Handles the service worker 'install' event.
 * Opens the cache and adds all essential URLs for offline functionality.
 * @param {ExtendableEvent} event - The install event, extended until caching completes.
 * @returns {Promise<void>} Resolves when all URLs are cached.
 * @throws {Error} If cache operations fail critically (logged, install continues).
 * @example
 * // Triggered automatically on SW registration
 * navigator.serviceWorker.register('sw.js');
 * @example
 * // Error case: network unavailable for external URLs
 * // Logs 'Cache addAll failed:' but completes install
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
 * Handles fetch events with 'stale while revalidate' strategy.
 * Serves cached response immediately, then updates cache asynchronously.
 * @param {FetchEvent} event - The fetch event containing request details.
 * @example
 * // Cached request: serves stale, updates in background
 * fetch('/api/data'); // Returns cached, fetches fresh
 * @example
 * // Navigation offline: serves /index.html
 * // When online navigation fails
 * @example
 * // Cross-origin request: passes through unchanged
 * fetch('https://external.com/api'); // No caching
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
 * Handles activation event by cleaning old caches.
 * Deletes caches not matching current CACHE_NAME to free storage.
 * @param {ExtendableEvent} event - The activate event.
 * @returns {Promise<void>} Resolves when cleanup is complete.
 * @example
 * // Automatic cleanup on SW update
 * // Old 'portfolio-v0' cache deleted, 'portfolio-v1' retained
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