#!/usr/bin/env node
/**
 * 圖標標準驗收（照 readme repo docs/33 G11 §9：唔可以靠肉眼）
 *
 * 檢查：
 *  1. 9 個圖標檔齊全，PNG 尺寸正確（讀 IHDR，唔需要 ImageMagick）
 *  2. 9 個檔總體積 ≤ 260 KB
 *  3. manifest 有 4 個 icon（any 192／any 512／maskable 192／maskable 512）
 *  4. index.html 有 5 條 icon/manifest link，og:image 係絕對網址嘅 PNG
 *  5. 唔准 SVG／WebP／AVIF 圖標
 *
 * 用法：node scripts/validate-icons.js
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const errors = [];

/** 讀 PNG 寬高（IHDR 喺固定 offset，唔靠外部工具） */
function pngSize(file) {
  const buffer = fs.readFileSync(file);
  if (buffer.length < 24 || buffer.toString('ascii', 1, 4) !== 'PNG') {
    throw new Error(`${path.basename(file)} 唔係有效 PNG`);
  }
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

/** 讀 ICO 內含尺寸（每張圖 entry 自己寫寬高，256 記 0） */
function icoSizes(file) {
  const buffer = fs.readFileSync(file);
  if (buffer.readUInt16LE(0) !== 0 || buffer.readUInt16LE(2) !== 1) {
    throw new Error('favicon.ico 唔係有效 ICO');
  }
  const count = buffer.readUInt16LE(4);
  const sizes = [];
  for (let i = 0; i < count; i += 1) {
    const offset = 6 + i * 16;
    sizes.push(buffer[offset] === 0 ? 256 : buffer[offset]);
  }
  return sizes;
}

const expected = [
  { file: 'favicon.ico', sizes: [16, 32, 48] },
  { file: 'favicon-16.png', width: 16, height: 16 },
  { file: 'favicon-32.png', width: 32, height: 32 },
  { file: 'apple-touch-icon.png', width: 180, height: 180 },
  { file: 'icon-192.png', width: 192, height: 192 },
  { file: 'icon-512.png', width: 512, height: 512 },
  { file: 'icon-maskable-192.png', width: 192, height: 192 },
  { file: 'icon-maskable-512.png', width: 512, height: 512 },
  { file: 'og-image.png', width: 1200, height: 630 }
];

let total = 0;
for (const item of expected) {
  const full = path.join(root, item.file);
  if (!fs.existsSync(full)) {
    errors.push(`缺少 ${item.file}`);
    continue;
  }
  total += fs.statSync(full).size;
  try {
    if (item.width) {
      const { width, height } = pngSize(full);
      if (width !== item.width || height !== item.height) {
        errors.push(`${item.file} 尺寸 ${width}×${height}，應為 ${item.width}×${item.height}`);
      }
    } else {
      const sizes = icoSizes(full);
      for (const size of item.sizes) {
        if (!sizes.includes(size)) errors.push(`favicon.ico 缺少 ${size}×${size}`);
      }
    }
  } catch (error) {
    errors.push(error.message);
  }
}

const budget = 260 * 1024;
if (total > budget) {
  errors.push(`9 個圖標共 ${(total / 1024).toFixed(1)} KB，超出 260 KB 預算`);
}

// 唔准用 SVG／WebP／AVIF 做站台圖標
for (const file of fs.readdirSync(root)) {
  if (/\.(svg|webp|avif)$/i.test(file) && /icon|favicon|logo/i.test(file)) {
    errors.push(`${file}：站台圖標只用 PNG／ICO`);
  }
}

const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8'));
const manifestIcons = manifest.icons || [];
for (const purpose of ['any', 'maskable']) {
  for (const size of ['192x192', '512x512']) {
    const found = manifestIcons.some(icon => icon.sizes === size && String(icon.purpose || 'any').includes(purpose));
    if (!found) errors.push(`manifest 缺 ${purpose} ${size} icon`);
  }
}

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const head = html.slice(0, html.indexOf('</head>'));
for (const pattern of [
  ['rel="icon"', 'favicon link'],
  ['sizes="16x16"', '16×16 favicon'],
  ['sizes="32x32"', '32×32 favicon'],
  ['rel="apple-touch-icon"', 'apple-touch-icon'],
  ['rel="manifest"', 'manifest link'],
  ['name="theme-color"', 'theme-color']
]) {
  if (!head.includes(pattern[0])) errors.push(`<head> 缺 ${pattern[1]}（${pattern[0]}）`);
}
const ogImage = (head.match(/property="og:image" content="([^"]+)"/) || [])[1] || '';
if (!/^https:\/\/.+\.png$/.test(ogImage)) {
  errors.push(`og:image 要用絕對網址嘅 PNG（現時：${ogImage || '無'}）`);
}

const versionMeta = (head.match(/name="app-version" content="([^"]+)"/) || [])[1];
const versionConst = (html.match(/const APP_VERSION = '([^']+)'/) || [])[1];
if (!versionMeta) errors.push('缺 <meta name="app-version">');
else if (!versionConst) errors.push('缺 APP_VERSION 常數');
else if (versionMeta !== versionConst) {
  errors.push(`版號唔一致：meta ${versionMeta} vs APP_VERSION ${versionConst}`);
}
if (!/name="copyright" content="© SCOUT SYSTEM"/.test(head)) {
  errors.push('缺 <meta name="copyright" content="© SCOUT SYSTEM">');
}
if (!/© SCOUT SYSTEM/.test(html)) errors.push('頁面無可見 © SCOUT SYSTEM 版權標示');

if (errors.length) {
  console.error(`❌ 圖標／版權驗收失敗（${errors.length} 項）`);
  errors.forEach(message => console.error('   ' + message));
  process.exit(1);
}
console.log(`✅ 圖標驗收通過：9 個檔、共 ${(total / 1024).toFixed(1)} KB（預算 260 KB）、manifest 4 個 icon、版號 ${versionMeta}`);
