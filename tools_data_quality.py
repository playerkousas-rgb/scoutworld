#!/usr/bin/env python3
"""Scout World 靜態資料品質檢查（無後台、無網絡請求）。
用法：python3 tools_data_quality.py
"""
import glob, json, os, re, sys
from datetime import date
from urllib.parse import urlparse

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(ROOT, 'data')
URL_RE = re.compile(r'^https?://', re.I)
errors, warnings = [], []
seen = set()
region_files = glob.glob(os.path.join(DATA, '*', 'region.json'))
for path in sorted(region_files):
    rel = os.path.relpath(path, ROOT)
    try:
        rows = json.load(open(path, encoding='utf-8'))
    except Exception as exc:
        errors.append(f'{rel}: JSON 無法讀取（{exc}）')
        continue
    if not isinstance(rows, list):
        errors.append(f'{rel}: 預期為陣列')
        continue
    for i, row in enumerate(rows, 1):
        where = f'{rel}#{i}'
        if not isinstance(row, dict):
            errors.append(f'{where}: 條目不是物件'); continue
        ident = row.get('id')
        if not ident: errors.append(f'{where}: 缺少 id')
        elif ident in seen: errors.append(f'{where}: 重複 id：{ident}')
        else: seen.add(ident)
        if not row.get('country'): warnings.append(f'{where}: 缺少 country')
        if not row.get('countryEn'): warnings.append(f'{where}: 缺少 countryEn')
        for key in ('website', 'wosmSource'):
            value = row.get(key)
            if value and not URL_RE.match(str(value)):
                warnings.append(f'{where}: {key} 不是 http(s) URL')

files = glob.glob(os.path.join(DATA, '**', 'local', '*.json'), recursive=True)

for path in sorted(files):
    rel = os.path.relpath(path, ROOT)
    try:
        rows = json.load(open(path, encoding='utf-8'))
    except Exception as exc:
        errors.append(f'{rel}: JSON 無法讀取（{exc}）')
        continue
    if not isinstance(rows, list):
        errors.append(f'{rel}: 預期為陣列')
        continue
    code = os.path.splitext(os.path.basename(path))[0]
    for i, row in enumerate(rows, 1):
        where = f'{rel}#{i}'
        if not isinstance(row, dict):
            errors.append(f'{where}: 條目不是物件'); continue
        ident = row.get('id')
        if not ident: errors.append(f'{where}: 缺少 id')
        elif ident in seen: errors.append(f'{where}: 重複 id：{ident}')
        else: seen.add(ident)
        if not row.get('name'): errors.append(f'{where}: 缺少 name')
        if not row.get('address') and not row.get('locationAccuracy'):
            warnings.append(f'{where}: 沒有 address，亦沒有 locationAccuracy 說明')
        if row.get('country') and row['country'] != code: warnings.append(f'{where}: country 與檔名不一致')
        for key in ('website', 'verificationSource', 'bookingUrl'):
            value = row.get(key)
            if value and not URL_RE.match(str(value)):
                warnings.append(f'{where}: {key} 不是 http(s) URL')
        lat, lng = row.get('lat'), row.get('lng')
        if lat is not None or lng is not None:
            if not isinstance(lat, (int, float)) or not isinstance(lng, (int, float)) or not (-90 <= lat <= 90 and -180 <= lng <= 180):
                errors.append(f'{where}: 座標超出範圍')
        if row.get('visitorNote', '').strip().startswith('✅') and not row.get('verificationSource'):
            warnings.append(f'{where}: 對外開放提示沒有 verificationSource')
        if row.get('sourceStatus') == 'removed-hijacked-domain' and row.get('verificationSource'):
            errors.append(f'{where}: sourceStatus 標示已移除但仍保留 verificationSource')
        if not row.get('verificationSource'):
            if row.get('sourceStatus') == 'removed-hijacked-domain':
                warnings.append(f'{where}: verificationSource 已因來源被騎劫而移除（保留安全狀態標記）')
            else:
                warnings.append(f'{where}: 沒有 verificationSource')
        reviewed = row.get('lastReviewed')
        if reviewed:
            try:
                age = (date(2026, 8, 13) - date.fromisoformat(reviewed)).days
                if age > 365:
                    warnings.append(f'{where}: lastReviewed 已超過一年（{reviewed}）')
            except ValueError:
                errors.append(f'{where}: lastReviewed 日期格式錯誤：{reviewed}')

print(f'掃描 {len(files)} 個資料檔、{len(seen)} 個條目')
print(f'❌ 錯誤：{len(errors)}    ⚠️ 提醒：{len(warnings)}')
for item in errors[:80]: print('ERROR', item)
for item in warnings[:40]: print('WARN ', item)
if len(errors) > 80 or len(warnings) > 40: print('（輸出已截取，請修正後再跑一次）')
sys.exit(1 if errors else 0)
