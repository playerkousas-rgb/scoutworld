# Scout World Data Policy

## Purpose

Scout World is a travel-planning reference for Hong Kong Scouts. It helps members quickly find public information about overseas Scouting before travel.

It is not a channel for formal overseas Scout communication. Formal overseas visits, exchanges, activities, or communication made in the name of Hong Kong Scouting must follow the Scout Association of Hong Kong procedure through the International Branch.

## Data levels

### L1 — Region

WOSM region / major Scout region, e.g. Asia-Pacific, Europe, Interamerica, Arab, Africa.

### L2 — Country / Territory / WOSM Member Organization

L2 records are based on WOSM official member organization listings. These are treated as the primary official baseline.

Required fields where possible:

- country / countryEn
- org / orgFull
- wosmRegion
- lat / lng
- wosmSource
- verificationStatus

### L3 — Local useful data

L3 may include:

- National HQ
- Member organization HQ under a federation
- Scout Shop
- Campsite / training centre / scout centre
- Group finder / local finder
- Council / region / branch
- Museum / heritage centre
- Activity network or official event location

L3 must have a reliable public source. Do not add L3 just to make a country look complete.

## Acceptable sources

Preferred:

1. WOSM official page
2. National Scout Organization official website
3. Official Scout Shop website
4. Official camp / centre website
5. Government / education / youth authority page
6. Official Facebook / Instagram / YouTube page
7. Official Linktree / BioLink / social landing page

Acceptable with caution:

- Reliable news article
- Partner organization page
- Government/NGO directory
- WOSM SDGs / Treehouse / Scout.org news article

If using a secondary source, set:

```json
"verificationStatus": "secondary-source; verify before travel"
```

Not acceptable as the only source:

- Wikipedia
- Wikiwand
- ScoutWiki / Scoutopedia
- Fandom wiki
- random travel listing with no official connection
- unverified personal blogs

## Email policy

Do not publish overseas official email addresses.

- `email` should be an empty string.
- Do not include email addresses in `description`.
- Use neutral wording such as `official contact details` or `official channels`.

Reason: formal overseas communication should go through the Scout Association of Hong Kong International Branch where applicable.

## Social platform policy

Facebook, Instagram and YouTube are allowed and encouraged when they are public information channels.

They are for:

- activity updates
- travel research
- informal international friendship
- public information discovery

They are not formal communication channels.

Use full URLs for:

- `facebook`
- `youtube`

Use handle only for:

- `instagram`

Examples:

```json
"facebook": "https://www.facebook.com/example/",
"instagram": "example_handle",
"youtube": "https://www.youtube.com/@example"
```

## Verification fields

Every L3 item should have:

```json
"verificationStatus": "...",
"verificationSource": "..."
```

If the item is a representative point / network entry rather than an exact physical location, add:

```json
"locationAccuracy": "representative-area-or-network-point; not an exact meeting place unless stated by source"
```

## When to remove data

Remove or downgrade data if:

- source is wiki-only
- source is dead and no alternative exists
- description sounds like a guessed location
- item is a generic city / capital council with no official source
- social page is clearly unrelated
- data may mislead members into thinking a representative point is an exact location

## When to add data

Add data when:

- it is useful for travel planning
- it has a source
- it is not already represented clearly
- it helps members find public Scouting information quickly

Good additions:

- official Scout Shop
- official camp / training centre
- official group finder
- national HQ
- federation member HQ
- official social channel
- public event / camp network with source

## Required checks

Before finishing any major update:

```bash
python3 - <<'PY'
import json, glob
for f in glob.glob('data/**/*.json', recursive=True):
    json.load(open(f, encoding='utf-8'))
print('JSON OK')
PY

grep -RInE "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}" data index.html *.md || true

grep -RInE "wikipedia|wikiwand|scoutwiki|維基" data || true
```

---

## 2026-08-10 修訂附註（全局收尾後新增規則）

1. **verificationSource 必須係單一 URL**（工具 link-checker 同 UI link target 都按單連結處理）；次要來源寫入 `verificationStatus` 文字並標明等級（official／official social／secondary／tertiary）。
2. **域名安全覆核**：官方連結如確認被騎劫（redirect 賭博／注入 spam），**立即移除 website 連結**＋`verificationStatus` 加 ⚠️ 警告同「資料來源：WOSM 官方名錄」；純粹連線失敗（HTTP 5xx / timeout）則保留連結＋警告。已知案例：kenyascouts.org、scoutismecongolais.org、aeascout.org（2026-08）。
3. **營地結構化欄位（2026-08-10 起）**：`fee`（短字串，≤20 字，例 `¥100/人/日`）同 `bookingUrl`（單一官方預訂／收費頁 URL）係選填欄位，**只可以由已核實官方來源提取**（例如官方頁已列明嘅收費表／預訂專站）。查唔到就留空，絕對唔可以估。寧願得 16 個真實收費，唔好 100 個虛構收費。UI 會自動顯示 💰 收費 chip 同 📅 預訂連結。
3. **新國家加入 L2 前**，必須先喺 index.html `countryRegionMap` 入面登記代碼，否則 L3 fetch 會 404（已設 jsdom regression test）。


### 規則 5（2026-08-10）：`visitorNote` 准入備註欄位
- **目的**：童軍出發前最常問——「呢個營地外國團體去唔去得？」一眼答到。
- **內容**：短句講准入——✅ 公眾/一般團體可申請｜❌ 只限登記團體或公眾不可用｜⚠️ 會員制/須向場地查詢｜❓ 未確認。
- **守綫**：只可以由已核實來源提取（官方頁講明／本身 description 已核實過）；官方冇寫外國團體准唔准嘅，用「出發前經總會國際署／連盟確認」字眼，唔好自己估。
- UI：詳情頁 🌏 chip＋列表行 🌏 圖標。
