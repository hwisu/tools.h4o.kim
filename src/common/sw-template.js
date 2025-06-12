/**
 * Return Service Worker script string parameterised by version
 * @param {string} version – App version string
 */
export function getServiceWorkerCode(version = '1') {
  return `// Service Worker for tools.h4o.kim
const CACHE_NAME = 'tools-v${version}';
const urlsToCache = [
  '/',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
`;
}
