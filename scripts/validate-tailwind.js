#!/usr/bin/env node
/**
 * Tailwind build 驗收（取代 cdn.tailwindcss.com 之後嘅防回歸閘門）
 *
 * 背景：以前 Tailwind 係 CDN 執行時 JIT，class 打錯最多都係「冇樣」；
 * 換成預先 build 之後，漏一個 class 就真係冇樣，而且 jsdom 睇唔出（佢唔計 CSS）。
 * 所以呢支 script 直接對答案：
 *   1. index.html 唔准再連 cdn.tailwindcss.com
 *   2. tailwind.css 存在、有 preflight、有 utilities
 *   3. index.html 用到嘅每個 Tailwind class 都要喺 tailwind.css 搵到對應 selector
 *   4. 色票覆寫（violet/blue/teal -> sky、pink/rose -> red、orange -> gold）真係生效
 *   5. 唔准有 build 產物同 index.html 唔一致（例如改完 HTML 唔記得重跑 `npm run css`）
 *
 * 用法：node scripts/validate-tailwind.js
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const cssPath = path.join(root, 'tailwind.css');
const errors = [];
const warnings = [];

if (!fs.existsSync(cssPath)) {
  console.error('❌ 搵唔到 tailwind.css，請先跑 `npm run css`');
  process.exit(1);
}
const css = fs.readFileSync(cssPath, 'utf8');

// ── 1. 唔准再依賴 Tailwind CDN ─────────────────────────────────────────
if (/<script[^>]+cdn\.tailwindcss\.com/i.test(html)) {
  errors.push('index.html 仍然載入 cdn.tailwindcss.com（執行時 JIT），應該用 /tailwind.css');
}
if (!/<link[^>]+href="\/tailwind\.css"/.test(html)) {
  errors.push('index.html 冇 <link rel="stylesheet" href="/tailwind.css">');
}

// ── 2. build 產物要齊 preflight + utilities ────────────────────────────
if (css.length < 5000) errors.push(`tailwind.css 太細（${css.length} bytes），似係 build 失敗`);
if (!/box-sizing:border-box|box-sizing: border-box/.test(css)) errors.push('tailwind.css 缺 preflight（box-sizing reset）');
if (!/\.flex\{|\.flex\s*\{/.test(css)) errors.push('tailwind.css 缺 utilities（.flex）');

// ── 3. class 覆蓋率 ────────────────────────────────────────────────────
// 只檢查 Tailwind 會產生嘅 class；其餘（Font Awesome、app 自己嘅 hook class、
// Tailwind 本身冇嘅數值，例如 scale-115）列做白名單。
const FA_AND_APP = /^(fa[- ]|fa-|fav-|hot-chip$|region-btn$|l3-type-btn$|l4-sub-btn$|nearby-result$|global-hit$|favorite-row$|scrollbar-none$|selected-marker-pulse$|custom-div-icon$|map-fullscreen$|sw-)/;
// 呢幾個喺舊 Tailwind（CDN 同 v3 預設）本身就冇，一向都係 dead class，唔算回歸
const ALREADY_DEAD = new Set(['h-7.5', 'w-7.5', 'h-8.5', 'w-8.5', 'hover:scale-115', 'scale-120', 'hover:scale-120']);

const UTILITY_ROOTS = [
  'bg-', 'text-', 'border-', 'ring-', 'ring-offset-', 'from-', 'via-', 'to-', 'divide-', 'placeholder-',
  'w-', 'h-', 'min-w-', 'min-h-', 'max-w-', 'max-h-', 'p-', 'px-', 'py-', 'pt-', 'pb-', 'pl-', 'pr-',
  'm-', 'mx-', 'my-', 'mt-', 'mb-', 'ml-', 'mr-', 'gap-', 'space-x-', 'space-y-', 'inset-', 'top-',
  'bottom-', 'left-', 'right-', 'z-', 'opacity-', 'rounded-', 'shadow-', 'font-', 'leading-',
  'tracking-', 'transition-', 'duration-', 'ease-', 'scale-', 'translate-x-', 'translate-y-',
  'rotate-', 'object-', 'aspect-', 'order-', 'col-', 'grid-cols-', 'grid-rows-', 'line-clamp-'
];
const BARE_UTILITIES = new Set([
  'hidden', 'block', 'flex', 'inline-flex', 'inline-block', 'grid', 'inline', 'contents',
  'absolute', 'relative', 'fixed', 'sticky', 'static', 'truncate', 'uppercase', 'lowercase',
  'capitalize', 'italic', 'antialiased', 'overflow-hidden', 'overflow-y-auto', 'overflow-x-auto',
  'underline', 'select-none', 'pointer-events-none', 'whitespace-pre-line', 'cursor-pointer',
  'shadow', 'shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl', 'shadow-inner',
  'transition', 'transition-all', 'transition-colors', 'transition-transform', 'rounded',
  'rounded-full', 'rounded-lg', 'rounded-xl', 'rounded-md', 'rounded-xl', 'border', 'border-2',
  'outline-none', 'flex-1', 'flex-shrink-0', 'flex-col', 'flex-wrap', 'items-center',
  'items-start', 'items-baseline', 'justify-between', 'justify-center', 'justify-end',
  'text-center', 'text-left', 'text-right', 'text-xs', 'text-sm', 'text-base', 'text-lg',
  'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'font-black', 'font-bold', 'font-extrabold',
  'font-semibold', 'font-medium', 'font-normal', 'font-mono', 'tracking-tight', 'tracking-wider',
  'tracking-wide', 'leading-tight', 'leading-relaxed', 'leading-none', 'normal-case', 'tabular-nums',
  'w-full', 'h-full', 'h-screen', 'space-y-1', 'space-y-2', 'space-y-3', 'backdrop-blur'
]);

function escapeClass(token) {
  return token.replace(/([:/.\[\]%()#!,])/g, '\\$1');
}

const tokens = new Set();
// 由 class / className 字串抽出（HTML 同 JS 一樣）
for (const match of html.matchAll(/class(?:Name)?\s*=\s*([`"'])([\s\S]*?)\1/g)) {
  const body = match[2].replace(/\$\{[^}]*\}/g, ' ');
  body.split(/\s+/).filter(Boolean).forEach(token => tokens.add(token));
}
// 由 JS 入面獨立嘅 class 字串抽出（例如 badgeColor = 'bg-white/5 …'）
for (const match of html.matchAll(/([`"'])([a-z0-9!:_ /\[\].%-]+?)\1/g)) {
  const raw = match[2].trim();
  if (!raw || raw.includes('://') || /\s/.test(raw) === false && raw.length > 40) continue;
  raw.split(/\s+/).filter(Boolean).forEach(token => tokens.add(token));
}

const missing = [];
const checked = new Set();
for (const token of tokens) {
  if (!/^[a-z0-9!:_/\[\].%-]+$/i.test(token)) continue;
  if (FA_AND_APP.test(token)) continue;
  if (ALREADY_DEAD.has(token)) continue;
  const base = token.replace(/^[a-z-]+:/, '').replace(/^!/, '');
  const isUtility = BARE_UTILITIES.has(base) || UTILITY_ROOTS.some(prefix => base.startsWith(prefix));
  if (!isUtility) continue;
  checked.add(token);
  const needle = '.' + escapeClass(token);
  if (!css.includes(needle)) missing.push(token);
}

if (missing.length) {
  errors.push(`有 ${missing.length} 個 Tailwind class 唔喺 tailwind.css（改完 HTML 記得跑 \`npm run css\`）：${missing.slice(0, 12).join(', ')}${missing.length > 12 ? ' …' : ''}`);
}

// ── 4. 色票覆寫要真係生效 ──────────────────────────────────────────────
const paletteChecks = [
  ['\\.text-violet-300\\{[^}]*125 211 252|125,211,252|#7dd3fc', 'text-violet-300 應該等於 sky-300'],
  ['\\.text-blue-400\\{[^}]*56 189 248|56,189,248|#38bdf8', 'text-blue-400 應該等於 sky-400'],
  ['\\.text-pink-400\\{[^}]*251 113 133|251,113,133|#fb7185', 'text-pink-400 應該等於 red-400'],
  ['\\.text-orange-300\\{[^}]*252 211 77|252,211,77|#fcd34d', 'text-orange-300 應該等於 gold-300']
];
for (const [pattern, message] of paletteChecks) {
  if (!new RegExp(pattern).test(css)) errors.push(`色票覆寫未生效：${message}`);
}
// 真係冇用 Tailwind 產生唔到嘅 off-brand 色相殘留（config 已經冇再 expose 原色）
const rawBrand = ['violet', 'indigo', 'blue', 'teal', 'purple', 'pink', 'rose', 'orange'];
const distinct = [];
for (const name of rawBrand) {
  const matches = css.match(new RegExp(`\\.text-${name}-\\d00\\{([^}]*)\\}`, 'g')) || [];
  matches.forEach(rule => distinct.push(rule.replace(/\{[^}]*\}/, '').replace('.', '')));
}

// ── 5. 報告 ────────────────────────────────────────────────────────────
const sizeKb = (fs.statSync(cssPath).size / 1024).toFixed(1);
const htmlBytes = Buffer.byteLength(html, 'utf8');
const cdnScript = 0;

if (errors.length) {
  console.error(`❌ Tailwind 驗收失敗（${errors.length} 項）`);
  errors.forEach(message => console.error('   ' + message));
  process.exit(1);
}
warnings.forEach(message => console.log('   ! ' + message));
console.log(`✅ Tailwind 驗收通過：tailwind.css ${sizeKb} KB、檢查咗 ${checked.size} 個 class、色票覆寫生效、index.html ${(htmlBytes / 1024).toFixed(0)} KB 冇再連 CDN`);
