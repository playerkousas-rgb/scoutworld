#!/usr/bin/env python3
"""
Scout World Explorer — 全球地點搜尋索引生成器
====================================================
掃描 data/ 內所有 L2 (region.json) 及 L3/L4 (local/*.json) 資料，
輸出輕量 `data/search-index.json`，供前端即時全域搜尋
（例如：輸入 "KISC"、"東京"、"Camp" 即刻跳去瑞士營地/日本用品社）。

用法:
    python3 tools_search_index_build.py
"""
import json
import glob
import os
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(ROOT, 'data')
OUTPUT = os.path.join(DATA_DIR, 'search-index.json')
COUNTS_OUTPUT = os.path.join(DATA_DIR, 'place-counts.json')

# folder name -> default flag prefix hint (not strictly required; entries keep their own flag)

def build_l2_entries():
    """L2 國家/資源層條目（country 名直達）。"""
    entries = []
    for path in sorted(glob.glob(os.path.join(DATA_DIR, '*', 'region.json'))):
        region_folder = os.path.basename(os.path.dirname(path))
        with open(path, encoding='utf-8') as fh:
            rows = json.load(fh)
        for row in rows:
            oid = row.get('id')
            if not oid:
                continue
            entries.append({
                'n': row.get('country') or '',
                'e': row.get('countryEn') or '',
                'o': row.get('org') or '',          # 組織簡稱（如 SAHK, BSA）
                't': 'National HQ',
                'c': oid,                            # 國家/資源代碼（直達）
                'i': oid,
                'f': row.get('flag') or '',
                'cc': row.get('country') or '',
                'rg': region_folder,
                'lvl': 2,
            })
    return entries


def build_local_entries():
    """L3/L4 地方分支、營地、用品社、區會。"""
    entries = []
    for path in sorted(glob.glob(os.path.join(DATA_DIR, '**', 'local', '*.json'), recursive=True)):
        code = os.path.splitext(os.path.basename(path))[0]
        region_folder = os.path.basename(os.path.dirname(os.path.dirname(path)))
        # data/local/HK.json 的結構少一層
        if os.path.basename(os.path.dirname(path)) == 'local' and os.path.basename(os.path.dirname(os.path.dirname(path))) == 'data':
            region_folder = 'hk'
        with open(path, encoding='utf-8') as fh:
            rows = json.load(fh)
        if not isinstance(rows, list):
            continue
        for row in rows:
            name = row.get('name') or ''
            if not name:
                continue
            entries.append({
                'n': name,
                'e': row.get('nameEn') or '',
                'o': '',
                't': row.get('type') or (row.get('category') or '').split(' ')[0] or 'Place',
                'c': code,
                'i': row.get('id') or f'{code}-{name}',
                'f': row.get('flag') or '',
                'cc': '',   # 前端會用 countryRegionMap + allScouts 補上國家中文名
                'rg': region_folder,
                'lvl': row.get('level') or 3,
                's': row.get('subregion') or '',
                'open': (row.get('visitorNote') or '').strip().startswith('✅'),
                'lat': row.get('lat'),
                'lng': row.get('lng'),
                'reviewed': row.get('lastReviewed'),
            })
    return entries


def main():
    l2 = build_l2_entries()
    l3 = build_local_entries()
    index = l2 + l3
    with open(OUTPUT, 'w', encoding='utf-8') as fh:
        json.dump(index, fh, ensure_ascii=False, separators=(',', ':'))

    # 額外輸出：每個國家嘅地方地點數量（列表徽章用）
    counts = {}
    for row in l3:
        c = row['c']
        if c not in counts:
            counts[c] = {'l3': 0, 'l4': 0, 'open': 0}
        if row.get('open'):
            counts[c]['open'] += 1
        if row.get('lvl') == 4:
            counts[c]['l4'] += 1
        else:
            counts[c]['l3'] += 1
    with open(COUNTS_OUTPUT, 'w', encoding='utf-8') as fh:
        json.dump(counts, fh, ensure_ascii=False, separators=(',', ':'))

    size_kb = os.path.getsize(OUTPUT) / 1024
    print(f'✅ search-index.json 已生成：L2={len(l2)}，L3/L4={len(l3)}，合共={len(index)} 條，大小 {size_kb:.1f} KB')
    print(f'✅ place-counts.json 已生成：{len(counts)} 個國家/代碼嘅地點數量')


if __name__ == '__main__':
    sys.exit(main())
