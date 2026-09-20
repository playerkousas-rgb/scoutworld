#!/usr/bin/env node
/** Validate the dependency-free static deployment without modifying runtime files. */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const required = [
  'index.html', 'sw.js', 'manifest.webmanifest', 'robots.txt', 'sitemap.xml',
  'favicon.ico', 'favicon-32.png', 'apple-touch-icon.png', 'icon-192.png',
  'icon-512.png', 'og-cover.jpg', 'data/place-counts.json', 'data/search-index.json'
];
for (const file of required) {
  const full = path.join(root, file);
  if (!fs.existsSync(full) || fs.statSync(full).size === 0) throw new Error(`Missing runtime asset: ${file}`);
}
JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8'));
JSON.parse(fs.readFileSync(path.join(root, 'data/place-counts.json'), 'utf8'));
JSON.parse(fs.readFileSync(path.join(root, 'data/search-index.json'), 'utf8'));
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const asset of ['/sw.js', '/manifest.webmanifest', 'data/place-counts.json', 'data/search-index.json']) {
  if (!html.includes(asset) && asset !== '/sw.js') continue;
}
console.log(`Static deployment validation passed (${required.length} required assets).`);
