/**
 * Service Worker for PWA
 * Handles caching and offline functionality
 */

const CACHE_NAME = 'calculator-v1.0.0';
const RUNTIME_CACHE = 'calculator-runtime-v1';

// Assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/css/responsive.css',
    '/css/theme.css',
    '/css/calculators.css',
    '/css/ads.css',
    '/css/animations.css',
    '/js/app.js',
    '/js/theme-switcher.js',
    '/js/storage-manager.js',
    '/assets/images/logo.svg',
    '/assets/images/favicon.ico',
    '/manifest.json'
];

// Popular calculator pages to cache
const CALCULATOR_PAGES = [
    '/calculators/emi-calculator.html',
    '/calculators/gst-calculator.html',
    '/calculators/bmi-calculator.html',
    '/calculators/basic-calculator.html',
    '/calculators/sip-calculator.html'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll([...STATIC_ASSETS, ...CALCULATOR_PAGES]);
            })
            .then(() => {
                console.log('Service Worker: Installed successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Install failed', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated successfully');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        // Don't cache ads or analytics
        if (url.hostname.includes('google') ||
            url.hostname.includes('doubleclick') ||
            url.hostname.includes('analytics')) {
            return;
        }
    }

    // Skip POST requests
    if (request.method !== 'GET') {
        return;
    }

    // Network first for API calls
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(networkFirst(request));
        return;
    }

    // Cache first for static assets
    if (isStaticAsset(url.pathname)) {
        event.respondWith(cacheFirst(request));
        return;
    }

    // Stale while revalidate for HTML pages
    if (request.headers.get('accept').includes('text/html')) {
        event.respondWith(staleWhileRevalidate(request));
        return;
    }

    // Default: Cache first
    event.respondWith(cacheFirst(request));
});

/**
 * Cache First Strategy
 * Try cache first, fallback to network, then cache the response
 */
async function cacheFirst(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    if (cached) {
        return cached;
    }

    try {
        const response = await fetch(request);
        if (response.status === 200) {
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        // Return offline page if available
        return caches.match('/offline.html');
    }
}

/**
 * Network First Strategy
 * Try network first, fallback to cache
 */
async function networkFirst(request) {
    const cache = await caches.open(RUNTIME_CACHE);

    try {
        const response = await fetch(request);
        if (response.status === 200) {
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        const cached = await cache.match(request);
        if (cached) {
            return cached;
        }
        throw error;
    }
}

/**
 * Stale While Revalidate Strategy
 * Serve from cache immediately, update cache in background
 */
async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    const fetchPromise = fetch(request).then((response) => {
        if (response.status === 200) {
            cache.put(request, response.clone());
        }
        return response;
    });

    return cached || fetchPromise;
}

/**
 * Check if resource is a static asset
 */
function isStaticAsset(pathname) {
    const staticExtensions = ['.css', '.js', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.woff', '.woff2', '.ttf'];
    return staticExtensions.some(ext => pathname.endsWith(ext));
}

// Handle messages from clients
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => caches.delete(cacheName))
            );
        }).then(() => {
            event.ports[0].postMessage({ success: true });
        });
    }
});

// Background sync for offline form submissions (if needed)
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-calculations') {
        event.waitUntil(syncCalculations());
    }
});

async function syncCalculations() {
    // Implement background sync logic if needed
    console.log('Service Worker: Syncing calculations');
}

// Push notifications (optional)
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};

    const options = {
        body: data.body || 'New update available',
        icon: '/assets/images/icon-192.png',
        badge: '/assets/images/badge.png',
        vibrate: [200, 100, 200],
        data: data
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Calculator Platform', options)
    );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        clients.openWindow(event.notification.data.url || '/')
    );
});

console.log('Service Worker: Loaded');
