/* ============================================================
   Scout World Explorer — Service Worker
   為香港童軍外遊而設：去到邊、斷網都可以繼續查資料！
   Strategy:
   - App shell (HTML / icons / manifest): cache-first
   - /data/*.json: stale-while-revalidate (出發前睇過嘅國家，旅途中離線用到)
   - 地圖圖磚 (OSM/CARTO): cache-first，設上限避免儲存爆滿
   - CDN (tailwind / leaflet / fontawesome / fonts): stale-while-revalidate
   - 其他頁面導航: network-first，離線時回退到主頁
   ============================================================ */

const VERSION = 'scoutworld-v2026.08.24.3';

const APP_SHELL_CACHE = `${VERSION}-shell`;
const DATA_CACHE = `${VERSION}-data`;
const RUNTIME_CACHE = `${VERSION}-runtime`;
const TILE_CACHE = `${VERSION}-tiles`;

const TILE_CACHE_LIMIT = 300; // 最多快取 300 塊地圖圖磚
const RUNTIME_CACHE_LIMIT = 60;

const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/favicon-32.png',
  '/apple-touch-icon.png',
  '/icon-192.png',
  '/icon-512.png',
  '/og-cover.jpg'
];

// 核心資料（離線首選）：全球六大區 + 世界資源層 + 搜尋索引 + 地點數量
const CORE_DATA = [
  '/data/local/HK.json',
  '/data/africa/region.json',
  '/data/americas/region.json',
  '/data/arab/region.json',
  '/data/asia-pacific/region.json',
  '/data/europe/region.json',
  '/data/scenes/region.json',
  '/data/world/region.json',
  '/data/search-index.json',
  '/data/place-counts.json'
];

const TILE_HOSTS = [
  'tile.openstreetmap.org',
  'basemaps.cartocdn.com',
  'a.basemaps.cartocdn.com',
  'b.basemaps.cartocdn.com',
  'c.basemaps.cartocdn.com',
  'd.basemaps.cartocdn.com'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const shell = await caches.open(APP_SHELL_CACHE);
      await shell.addAll(APP_SHELL);
      const data = await caches.open(DATA_CACHE);
      // 資料快取逐個進行，單一失敗唔會拖累成個安裝
      await Promise.allSettled(CORE_DATA.map((url) => data.add(url)));
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keep = [APP_SHELL_CACHE, DATA_CACHE, RUNTIME_CACHE, TILE_CACHE];
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith('scoutworld-') && !keep.includes(key))
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    // 刪走最早放入嘅一批，騰出空間
    const removeCount = keys.length - maxItems;
    await Promise.all(keys.slice(0, removeCount).map((key) => cache.delete(key)));
  }
}

async function cacheFirst(request, cacheName, trimLimit) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request, { ignoreSearch: false });
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && (response.ok || response.type === 'opaque')) {
      cache.put(request, response.clone()).then(() => {
        if (trimLimit) trimCache(cacheName, trimLimit);
      });
    }
    return response;
  } catch (err) {
    // 離線又無快取：地圖圖磚回退 1x1 透明 PNG，避免破圖
    return new Response(
      Uint8Array.from(atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='), (c) => c.charCodeAt(0)),
      { status: 200, headers: { 'Content-Type': 'image/png' } }
    );
  }
}

async function staleWhileRevalidate(request, cacheName, trimLimit) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request, { ignoreSearch: true });
  const networkPromise = fetch(request)
    .then((response) => {
      if (response && (response.ok || response.type === 'opaque')) {
        cache.put(request, response.clone()).then(() => {
          if (trimLimit) trimCache(cacheName, trimLimit);
        });
      }
      return response;
    })
    .catch(() => null);
  if (cached) {
    // 背景更新，下一版本資料自動生效
    networkPromise.catch(() => null);
    return cached;
  }
  const response = await networkPromise;
  if (response) return response;
  return new Response(JSON.stringify({ error: 'offline', offline: true }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function networkFirstWithShellFallback(request) {
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(APP_SHELL_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cache = await caches.open(APP_SHELL_CACHE);
    const fallback = await cache.match('/index.html', { ignoreSearch: true });
    return fallback || Response.error();
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;

  // 地圖圖磚：cache-first（離線重溫睇過嘅地區）
  if (TILE_HOSTS.some((host) => url.hostname.endsWith(host))) {
    event.respondWith(cacheFirst(request, TILE_CACHE, TILE_CACHE_LIMIT));
    return;
  }

  if (sameOrigin) {
    // 資料 JSON：stale-while-revalidate
    if (url.pathname.startsWith('/data/') && url.pathname.endsWith('.json')) {
      event.respondWith((async () => {
        const offline = await caches.match(request);
        if (!navigator.onLine && offline) return offline;
        return staleWhileRevalidate(request, DATA_CACHE);
      })());
      return;
    }
    // 頁面導航：network-first，離線用 shell
    if (request.mode === 'navigate') {
      event.respondWith(networkFirstWithShellFallback(request));
      return;
    }
    // 其他同源靜態資源（icon、manifest 等）：cache-first
    if (/\.(png|jpe?g|ico|svg|webmanifest|css|js)$/i.test(url.pathname)) {
      event.respondWith(cacheFirst(request, APP_SHELL_CACHE));
      return;
    }
    return;
  }

  // 第三方 CDN（tailwind、leaflet、fontawesome、google fonts、unpkg）：stale-while-revalidate
  if (
    /tailwindcss\.com|cdnjs\.cloudflare\.com|unpkg\.com|googleapis\.com|gstatic\.com|jsdelivr\.net/.test(
      url.hostname
    )
  ) {
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE, RUNTIME_CACHE_LIMIT));
    return;
  }
});
