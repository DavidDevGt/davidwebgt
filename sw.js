const CACHE_NAME = 'david-vargas-portfolio-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/proyectos.html',
    '/sobre-mi.html',
    '/manifest.json',
    '/assets/css/styles.css',
    '/assets/js/script.js',
    '/assets/js/ui.js',
    '/assets/js/theme.js',
    '/assets/js/search.js',
    '/assets/js/utils.js',
    '/assets/js/searchIndex.js',
    '/assets/cv.pdf',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://unpkg.com/lucide@latest'
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
            .catch(err => console.error('Cache addAll failed:', err))
    );
});

// Fetch event
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

// Activate event
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