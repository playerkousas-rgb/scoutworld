#!/usr/bin/env node
/**
 * i18n 覆蓋檢查（無網絡、無瀏覽器）
 *
 * 1. 抽出 index.html 內嘅 EN / EN_HTML 字典，確認係有效 JSON、冇重複 key。
 * 2. 掃描程式碼所有 tr('中文…') 呼叫，確認每個 key 都有英文翻譯。
 * 3. 用 jsdom 掃描靜態 HTML 嘅文字節點同 title / aria-label / alt /
 *    placeholder，確認英文模式唔會殘留中文界面字。
 *
 * 只會檢查「界面字」（chrome）。地點名、簡介、地址等資料內容係
 * 中文原文，屬預期情況，唔會當作漏譯。
 */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.resolve(__dirname, '..');
const HTML_PATH = path.join(ROOT, 'index.html');
const html = fs.readFileSync(HTML_PATH, 'utf8');
const CJK = /[\u4e00-\u9fff]/;
const errors = [];

/** 用括號配對抽出 `const NAME = { … }`，避免字典內嘅字串影響定位。 */
function extractJsonBlock(source, name) {
  const marker = `const ${name} = {`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`找不到 ${name} 字典`);
  const from = start + marker.length - 1;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = from; i < source.length; i += 1) {
    const ch = source[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        const body = source.slice(from, i + 1);
        return { body, start: from, end: i + 1 };
      }
    }
  }
  throw new Error(`${name} 字典未閉合`);
}

function topLevelKeys(body) {
  // 只取第一層 key，用嚟偵測重複（JSON.parse 會靜靜食掉重複 key）
  const keys = [];
  let depth = 0;
  let inString = false;
  let escaped = false;
  let current = '';
  let expectingKey = false;
  for (let i = 0; i < body.length; i += 1) {
    const ch = body[i];
    if (inString) {
      if (escaped) { current += ch; escaped = false; }
      else if (ch === '\\') { current += ch; escaped = true; }
      else if (ch === '"') {
        inString = false;
        if (depth === 1 && expectingKey) keys.push(JSON.parse(`"${current}"`));
        current = '';
      } else current += ch;
      continue;
    }
    if (ch === '"') {
      // 第一層 key 一定緊隨 { 或 ,
      const prev = body.slice(0, i).trimEnd().slice(-1);
      inString = true;
      expectingKey = depth === 1 && (prev === '{' || prev === ',');
      current = '';
    } else if (ch === '{' || ch === '[') depth += 1;
    else if (ch === '}' || ch === ']') depth -= 1;
    else if (ch === ':' && depth === 1) expectingKey = false;
  }
  return keys;
}

let EN = {};
let EN_HTML = {};
for (const name of ['EN', 'EN_HTML']) {
  const { body } = extractJsonBlock(html, name);
  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch (err) {
    errors.push(`${name} 字典唔係有效 JSON：${err.message}`);
    continue;
  }
  const keys = topLevelKeys(body);
  const dupes = keys.filter((key, index) => keys.indexOf(key) !== index);
  [...new Set(dupes)].forEach(key => errors.push(`${name} 有重複 key：${key}`));
  const blank = Object.entries(parsed).filter(([, value]) => typeof value !== 'string' || !value.trim());
  blank.forEach(([key]) => errors.push(`${name} 嘅 "${key}" 翻譯係空字串`));
  if (name === 'EN') EN = parsed; else EN_HTML = parsed;
}

// ---------- 2. tr() key 覆蓋 ----------
const i18nStart = html.indexOf('<!-- i18n：');
const i18nEnd = html.indexOf('<!-- APP SCRIPTS -->');
const appCode = i18nStart >= 0 && i18nEnd > i18nStart
  ? html.slice(0, i18nStart) + html.slice(i18nEnd)
  : html;

const unescapeJs = source => JSON.parse(`"${source.replace(/"/g, '\\"').replace(/\\'/g, "'")}"`);
const usedKeys = new Set();
for (const m of appCode.matchAll(/tr\(\s*'((?:[^'\\]|\\.)*)'/g)) usedKeys.add(unescapeJs(m[1]));
for (const m of appCode.matchAll(/tr\(\s*"((?:[^"\\]|\\.)*)"/g)) usedKeys.add(unescapeJs(m[1]));
usedKeys.forEach(key => {
  if (EN[key] === undefined) errors.push(`漏譯（tr）：${JSON.stringify(key)}`);
});

// data-i18n-html key 覆蓋
const htmlKeys = new Set([...appCode.matchAll(/data-i18n-html="([^"]+)"/g)].map(m => m[1]));
htmlKeys.forEach(key => {
  if (EN_HTML[key] === undefined) errors.push(`漏譯（data-i18n-html）：${key}`);
});

// ---------- 3. 靜態 DOM 覆蓋 ----------
const dom = new JSDOM(html, { url: 'https://scoutworld.vercel.app/' });
const doc = dom.window.document;
const skipTags = new Set(['script', 'style', 'svg', 'noscript']);
const attrNames = ['title', 'aria-label', 'alt', 'placeholder'];

function isSkipped(el) {
  for (let node = el; node && node.nodeType === 1; node = node.parentElement) {
    if (skipTags.has(node.tagName.toLowerCase())) return true;
    if (node.id === 'map' || node.hasAttribute('data-i18n-skip')) return true;
    if (node.hasAttribute('data-i18n-html')) return true;
  }
  return false;
}

const walker = doc.createTreeWalker(doc.body, dom.window.NodeFilter.SHOW_TEXT);
let node;
while ((node = walker.nextNode())) {
  const el = node.parentElement;
  if (!el || isSkipped(el)) continue;
  const text = node.nodeValue.replace(/\s+/g, ' ').trim();
  if (!text || !CJK.test(text)) continue;
  if (EN[text] === undefined) errors.push(`漏譯（靜態文字）：${JSON.stringify(text)}`);
}

doc.querySelectorAll('*').forEach(el => {
  if (isSkipped(el)) return;
  attrNames.forEach(attr => {
    const value = el.getAttribute(attr);
    if (!value || !CJK.test(value)) return;
    const key = value.replace(/\s+/g, ' ').trim();
    if (EN[key] === undefined) errors.push(`漏譯（${attr}）：${JSON.stringify(key)}`);
  });
});

// <title> 同 meta 用 data-i18n-attr，key 就係原本嘅中文內容
doc.querySelectorAll('title, meta[data-i18n-attr]').forEach(el => {
  const value = el.tagName.toLowerCase() === 'title' ? el.textContent : el.getAttribute('content');
  if (!value || !CJK.test(value)) return;
  const key = value.replace(/\s+/g, ' ').trim();
  if (EN[key] === undefined) errors.push(`漏譯（head）：${JSON.stringify(key)}`);
});

if (errors.length) {
  console.error(`❌ i18n 檢查失敗：${errors.length} 項`);
  errors.forEach(message => console.error('   ' + message));
  process.exitCode = 1;
} else {
  console.log(`i18n 檢查通過：${Object.keys(EN).length} 條英文翻譯，${usedKeys.size} 個 tr() key，${htmlKeys.size} 段 HTML 翻譯。`);
}
