# Scout World Roadmap 2026

## Phase 1 — Global baseline completion ✅

Status: Completed on 2026-06-11.

Completed:

- All five regions have L2 data based on WOSM member organization entries.
- All regions have local JSON files.
- Empty local JSONs were given HQ entries where needed.
- Overseas official email addresses were removed.
- Generic unsourced L3 entries were removed from multiple regions.
- Verification metadata was added.
- Reports were created for APAC, Europe, Americas, Arab and Africa.

## Phase 2 — Global deep enrichment ✅

Status: **Region-by-region sweep completed 2026-08-10** (waves 1–11, see DATA_COVERAGE_REPORT_2026-08-07.md).

Completed so far:

- Europe received extensive social enrichment.
- Americas received US/Canada high-value L3 entries, Latin America social links and some group finders / shops.
- Africa received priority social links and several official camps / shops / training centres.
- Arab received several official social links and Oman official camps/training information entry.

2026-08-07 → 2026-08-10 完成嘅 11 波重點：

- APAC：HK 59 深層、TW 34、日本/韓國/澳洲/新加坡/泰國三柱；馬來西亞 scoutmy.org 新門戶補回；澳門官網持續 500 留覆查清單
- Europe：GB Scout Adventures 9/9 中心齊（Hawkhirst 結業即時剔除）、法德瑞比利時意官方揀團器、13 小國審計無填充
- Americas：加拿大 Haliburton/Byng/Find a Group、墨西哥 Meztitla、南美 UEB/阿根廷營地/秘魯用品社
- Africa：南非訪客程序、肯亞 Paxtu 朝聖地（兼發現 kenyascouts.org 域名入侵）
- Arab：黎巴嫩 LSA、約旦總部更新
- Caribbean+Oceania：BB 用品社、BS 營地、DO 北辦、NZ venues/Waiora 錯置修正

Remaining backlog (「進階深度」留返下個 sweeps)：

1. 覆查清單：澳門 scout.org.mo、千里達 scouts.tt（522）、阿魯巴 scoutingaruba.com（500）、哥斯達黎加（×3 連線失敗）、巴林/摩洛哥（連線失敗）、Burundi/利比亞（2026-08-10 連線失敗）
2. 拉美小國 BO/PY/UY/VE/EC 官方公開資料不足
3. 衝突國家 SY/YE/LY/SD/LR 保持 HQ-only

## Phase 3 — Link checking ✅ (2026-08-10 targeted sweep)

Initial scan completed 2026-06-11. **Second sweep 2026-08-10**:

- Full automated bulk sweep blocked by sandbox egress limits; replaced with a **targeted 12-link proxy sweep** (fetch-based) covering thin-country HQ websites and all previously-suspect domains.
- 🚨 **2 domains confirmed hijacked → links removed from data**: scoutismecongolais.org (CG, redirect→賭博網), aeascout.org (AO, redirect→casino)。kenyascouts.org 入侵複核仍存在（已成嘅警告 label 更新至 2026-08-10）。
- 7 unreachable/blocked official sites flagged verify-before-travel in `verificationStatus` (TT/AW/CR/BI/LY/MO×2/MZ)。
- 5 active official sites upgraded to verified-live with fresh official stats (KM/GH/MV/MN/CD)。
- Data bugfix: 11 條第11/12波「多 URL 用分號分隔」嘅 verificationSource 已收復做單一主 URL（避免壞 link target）。
- Full `tools_link_check.py` bulk sweep remains **scheduled for an environment with open egress** (see Phase 7 annual review command).

## Phase 4 — Map and coordinate refinement 🔄

Initial audit completed on 2026-06-11. See `COORDINATE_AUDIT_REPORT_2026-06-11.md`.

Tasks:

- refine exact HQ coordinates
- refine Scout Shop coordinates
- refine campsite entrances
- distinguish representative points from exact locations

## Phase 5 — UI clarity improvements 🔄

Initial verification badges added on 2026-06-11. Static UI QA completed; see `UI_QA_REPORT_2026-06-11.md`. Badge legend modal, L3 type filters and universal Scout emblem placeholder added.

Suggested front-end badges:

- WOSM L2 official
- Official website source
- Official social source
- Secondary source
- Verify before travel
- Representative point, not exact location

## Phase 5b — Official logo / emblem enrichment

Planned.

Tasks:

- Add optional `logoUrl` fields for NSO/member organization official logos where source permits.
- Use WOSM / NSO official logo URLs only.
- Keep universal ⚜️ fallback when official logo is unavailable.

## Phase 6 — Contribution workflow

Planned.

Create:

- GitHub issue template for data correction
- GitHub issue template for new Scout Shop / campsite
- PR checklist
- required source field
- no-email reminder

## Phase 9 — 世界版圖補完與全局收尾 ✅

Status: Completed 2026-08-10.

- **跨區 WOSM 官方名錄總對賬**：亞太 33/33・美洲 34/34（加拿大一國兩會以1計共35）・阿拉伯 19/19・歐洲 47/47（官方聲明 47 NSO）・非洲 39→**42/42**。
- 新增 L2：🇨🇬 剛果（布）、🇬🇼 畿內亞比紹（2017 WOSM 入會）、🇲🇱 馬里（2024-06 第 175 個 WOSM 會員）。
- 波利尼西亞微型國家（薩摩亞/湯加/瓦努阿圖/吐瓦魯）**不是** WOSM 正式會員，維持不加（準確優先）。
- 修復 `countryRegionMap` 硬編漏三碼 bug（jsdom 測試捉到，已加 regression test）。
- 里程碑數字：L2 = 223（176 個 WOSM 會員國 100% 覆蓋）・L3/L4 地點 **1,131**・搜尋索引 **1,354**・覆蓋代碼 **178**。

## Phase 7 — Annual review

Planned.

Every 6–12 months:

- scan links
- check WOSM member changes
- check social channels
- check camps and Scout Shops
- update reports

## World resources layer

- Initial layer completed: WSB, KISC, SCENES directory, WOSM Services, JOTA-JOTI, World Scout Foundation.
- Future: add selected SCENES centre deep links by country only if official and useful for travel planning.

## Phase 8 — HK Scout trip-planning product release ✅

Status: Completed on 2026-08-07. Live at https://scoutworld.vercel.app/

Goal: become the go-to pre-trip planning site for Hong Kong Scouts visiting scout units, buying gear, and booking campsites overseas.

Follow-up audit (2026-08-07, see DATA_COVERAGE_REPORT_2026-08-07.md): all 173 WOSM members have local files and clean data quality, but 80 countries hold ≤1 item. Country-first flow strengthened accordingly.

Completed:

- Hot destination quick chips (JP/TW/KR/SG/TH/AU/GB/CH) with one-tap country jump.
- Country-first browsing transparency: per-country place-count badges in the org list (`🏕️ N 地點`, orange highlight when ≥5) powered by `data/place-counts.json`; drawer coverage notes celebrate rich regions and guide thin regions to official-event search.
- Global place search index (`data/search-index.json`, 1297 entries) generated by `tools_search_index_build.py`; 2-character lazy search jumping straight to campsites, Scout Shops and districts.
- Per-destination share links (`/#GB` style hash routing) with native share sheet / clipboard fallback.
- PWA offline mode via `sw.js` (app shell + data JSON + map tiles caching), installable via `manifest.webmanifest`.
- Travel toolbox rebuilt around a 5-step planning flow (destination → ILI via International Dept → campsite booking → Shop hours → badge swapping), plus emergency contacts (Immd (852) 1868, OTA).
- SEO pack: meta description, Open Graph/Twitter card (`og-cover.jpg` 1200×630), JSON-LD, favicon suite, robots.txt, sitemap.xml, canonical, `lang="zh-Hant-HK"`.
- vercel.json headers for sw.js/manifest/data caching.

Next targets:

- Expand search index with keywords/aliases (e.g. common misspellings, airport codes).
- Collect popular HK-scout trip itineraries as shareable preset bundles.
- Continue Phase 2 data enrichment backlog.
