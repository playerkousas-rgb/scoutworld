#!/usr/bin/env node
/** Validate the dependency-free static deployment without modifying runtime files. */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const required = [
  'index.html', 'store_gate_v1.0.js', 'sw.js', 'tailwind.css', 'manifest.webmanifest', 'robots.txt', 'sitemap.xml',
  'favicon.ico', 'favicon-16.png', 'favicon-32.png', 'apple-touch-icon.png', 'icon-192.png',
  'icon-512.png', 'icon-maskable-192.png', 'icon-maskable-512.png', 'og-image.png',
  'data/place-counts.json', 'data/search-index.json'
];
for (const file of required) {
  const full = path.join(root, file);
  if (!fs.existsSync(full) || fs.statSync(full).size === 0) throw new Error(`Missing runtime asset: ${file}`);
}
JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8'));
JSON.parse(fs.readFileSync(path.join(root, 'data/place-counts.json'), 'utf8'));
JSON.parse(fs.readFileSync(path.join(root, 'data/search-index.json'), 'utf8'));
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
// CARTO 由 2026-08 起，匿名 raster tile 會回「API KEY REQUIRED」水印 → 唔可以再用
if (/basemaps\.cartocdn\.com/.test(html)) {
  throw new Error('index.html 仍然用 CARTO 圖磚（匿名請求會出水印），請用 OpenStreetMap／Esri');
}
if (!/tile\.openstreetmap\.org/.test(html)) {
  throw new Error('index.html 冇免 API key 嘅底圖（tile.openstreetmap.org）');
}
for (const [asset, reference] of [
  ['sw.js', /\bserviceWorker\.register\(\s*['"]\/?sw\.js['"]\s*\)/],
  ['manifest.webmanifest', /<link\s+rel="manifest"\s+href="\/manifest\.webmanifest"/],
  ['data/place-counts.json', /\bfetch\(\s*['"]\/?data\/place-counts\.json['"]\s*\)/],
  ['data/search-index.json', /\bfetch\(\s*['"]\/?data\/search-index\.json['"]\s*\)/]
]) {
  if (!reference.test(html)) throw new Error(`index.html 缺少或錯誤引用：${asset}`);
}
const charsetOffset = html.indexOf('<meta charset="UTF-8">');
const gateOffset = html.indexOf('<script src="/store_gate_v1.0.js"></script>');
const initOffset = html.indexOf('initStoreGate({');
const titleOffset = html.indexOf('<title>');
if (!(charsetOffset >= 0 && charsetOffset < gateOffset && gateOffset < initOffset && initOffset < titleOffset)) {
  throw new Error('Store Gate 要同步載入同初始化，放喺 charset 之後、title 之前');
}
const appShell = /const APP_SHELL = \[([\s\S]*?)\];/.exec(fs.readFileSync(path.join(root, 'sw.js'), 'utf8'))?.[1];
if (!appShell?.includes("'/store_gate_v1.0.js'")) throw new Error('Service Worker 離線快取未包含 Store Gate');
console.log(`Static deployment validation passed (${required.length} required assets).`);
