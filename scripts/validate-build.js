#!/usr/bin/env node
/** Validate the dependency-free static deployment without modifying runtime files. */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const required = [
  'index.html', 'sw.js', 'tailwind.css', 'manifest.webmanifest', 'robots.txt', 'sitemap.xml',
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
for (const asset of ['/sw.js', '/manifest.webmanifest', 'data/place-counts.json', 'data/search-index.json']) {
  if (!html.includes(asset) && asset !== '/sw.js') continue;
}
console.log(`Static deployment validation passed (${required.length} required assets).`);
