# Scout World Explorer 🌍⚜️

幫**香港童軍出發前做資料搜集**嘅互動世界地圖——探訪海外童軍單位、
買童軍用品、訂營地，一站搵齊。

**Live site: https://scoutworld.vercel.app/**

## 呢個係咩

唔係行程規劃工具，而係一個**資料庫**——價值在於資料量 × 準確度：

| 層級 | 內容 | 規模（2026-08-14） |
| --- | --- | --- |
| L2 | WOSM 會員國／地區總會 | 223（176 個 WOSM 會員全覆蓋＋SCENES 45） |
| L3/L4 | 各地總部、用品店、營地、博物館、區會 | **1,143** 個地點、178 個國家／地區碼 |

每個地點都帶查證來源同核實狀態；未核實嘅會誠實標明。
資料政策見 [DATA_POLICY.md](DATA_POLICY.md)；逐波擴展嘅審計紀錄見
[DATA_COVERAGE_REPORT_2026-08-07.md](DATA_COVERAGE_REPORT_2026-08-07.md)。

## 中英雙語（中文 / English）

右上角 🌐 掣可以即時切換**繁體中文**同 **English**；選擇會記住喺用家自己部機
（`localStorage` 嘅 `sw-lang`），預設中文，唔會影響原有香港用戶。

- **已翻譯**：全部介面文字（按鈕、標題、篩選、提示、外遊工具箱彈窗、離線下載狀態）、
  地點／國家／組織英文名（用資料本身嘅 `nameEn` / `countryEn` / 括號內英文）、
  分類標籤、分區／地域標籤（例如 `HK Island`、`N.T. East`、`Wong Tai Sin District`）、
  日期格式，以及 `<title>`、meta description、Open Graph。
- **保持原文**：地點簡介（`description`）、地址、查證狀態等**資料內容**。
  英文模式會喺詳情頁老實標明「簡介以中文原文提供，未經翻譯」，唔會偷雞機翻，
  守住「準確 > 數量」。
- **點加翻譯**：介面字典集中喺 `index.html` 嘅 `EN`（純文字）同 `EN_HTML`
  （含 `<strong>`／`<a>` 嘅段落）。key 就係中文原文，值係英文；有插值用
  `{name}`，例如 `tr('共 {n} 個地點', { n: 12 })`。新增任何中文界面字都要補英文，
  `npm run test:i18n` 會掃描靜態 HTML、`title`／`aria-label` 同所有 `tr()`
  呼叫，列出漏譯或者空字串，並統計 `data/**` 入面分類／地域／分區嘅英文覆蓋率
  （現時分類、地域、分區全部 100%，下限就係 100%：日後新增地點漏譯，`npm run check` 會即刻紅）。
- **香港分區英文名來源**：一律跟香港童軍總會官方
  [Regions and Districts](https://www.scout.org.hk/en/scout-units/regions-districts/index.html)
  頁面（例如 港島北區 → `Northern District`、沙田東區 → `Shatin East District`、
  銀禧區 → `Silver Jubilee District`、璧峰區 → `Pik Fung District`、雙魚區 → `Sheung Yue District`），
  唔會自行意譯；官方名單日後若有改動，改 `EN` 字典一條 key 即可。

## 介面品質（照 house standard）

介面基本功跟 [`playerkousas-rgb/readme`](https://github.com/playerkousas-rgb/readme) 嘅標準做，
唔係憑感覺：

- **圖標（G11）**：9 個 PNG／ICO（含 16×16 手繪、2 個 maskable、1200×630 PNG og 圖），
  合共 171.8 KB（預算 260 KB）。母圖係「夜空＋金色指南針＋奶白 fleur-de-lis＋綠色島嶼」，
  full bleed、5 色、主體收喺中央（見 `UI_REVIEW_2026-11-06.md` §6）。`npm run test:icons` 會讀 PNG 尺寸、ICO 內含尺寸、
  manifest 4 個 icon、`<head>` 5 條 link、`og:image` 要絕對網址，同埋版號一致性 ——
  冇得靠肉眼。
- **無障礙**：全站 `:focus-visible` 焦點環、詳情抽屜係 `role="dialog"` + `aria-modal` +
  開關時 `aria-hidden`／`inert` 同步、焦點會移入同還原；結果數量有 `aria-live`；
  大區／級別分頁有 `aria-pressed`；尊重 `prefers-reduced-motion`。
- **手機**：用 `100dvh`（唔會被 URL bar 剪）、輸入框 16px（iOS 唔會自動放大）、
  字級下限 11px（原本有 9px／10px）；地圖預設收成 **120px 條狀**（清單優先），
  撳「展開地圖」先放大到 55vh（`aria-expanded` 跟住變，Leaflet 會 `invalidateSize()`）。
- **配色系統**：只用深藍底 + 品牌金（amber）＋ 3 個語意色 ——
  `emerald`＝已核實／可去、`sky`＝資料性質（社交／二手／代表點）、`red`＝危險／清空，
  其餘係 slate 中性。舊 code 嘅 violet／indigo／blue／teal／purple／pink／rose／orange
  由 `tailwind.config` 一次過對應（連 `/50` 透明度版本），所以**加新元件唔會再引入新色相**。
  類型（旅團／區會／Shop…）用中性色章，顏色只表示可信度；社交平台 logo 保留品牌色。
- **版權／版號（W1／V2）**：頁尾 `© SCOUT SYSTEM · vYYYY.MM.DD`、`<meta name="copyright">`、
  `APP_VERSION` 常數 ＋ `<meta name="app-version">`，三處對唔上 `test:icons` 會紅。
- **一次過跑**：`npm run check`（lint + i18n + icons + 24 項 runtime + build）。
- 2026-11-06 嘅完整檢查報告（含未做項目同原因）：[`UI_REVIEW_2026-11-06.md`](UI_REVIEW_2026-11-06.md)。

### 順手做咗嘅資料瘦身

`contactPolicy`（總會國際署聯絡政策）原本**逐條記錄重複 1,552 次**、佔約 270 KB。
現已改為介面內單一常數 `contactPolicyText()`（中英各一份），`data/` 由 3.3 MB
減到約 2.1 MB，日後加語言亦唔需要再複製 1,552 次。

## 維護及離線使用

Scout World 沒有後台，收藏及目的地離線資料只儲存在使用者自己的瀏覽器。出發前可下載目的地資料；離線資料及收藏可在瀏覽器內管理。

資料維護工具：

- `python3 tools_data_quality.py`：檢查 JSON、ID、來源、座標、日期及代表點說明
- `python3 tools_search_index_build.py`：重建搜尋索引及地點統計
- `npm run test:runtime`：執行 jsdom runtime tests（先啟動 `python3 -m http.server 8080`）

GitHub Actions 會在資料變更時執行資料品質及 runtime tests，並每月檢查來源連結。連線檢查只代表網址有回應，不代表開放時間、收費或預約資料仍然正確；出發前仍需查看原始來源。

年度覆審報告：

- [五區總結](ANNUAL_REVIEW_SUMMARY_2026-08-14.md)
- [亞太區](REVIEW_ASIA_PACIFIC_2026-08-14.md)
- [歐洲區](REVIEW_EUROPE_2026-08-14.md)
- [非洲區](REVIEW_AFRICA_2026-08-14.md)
- [美洲區](REVIEW_INTERAMERICA_2026-08-14.md)
- [阿拉伯區＋World／SCENES](REVIEW_ARAB_WORLD_2026-08-14.md)

分類覆蓋報告：

- [Scout Shop](SHOP_COVERAGE_REPORT_2026-08-14.md)
- [營地](CAMP_COVERAGE_REPORT_2026-08-13.md)
- [總部及省區／地域](HQ_COVERAGE_REPORT_2026-08-13.md)
- [特殊地點及其他分類](OTHER_PLACES_COVERAGE_REPORT_2026-08-13.md)

## 貢獻資料

見到新地點、死連、過期資料？最理想係開個 issue（約 1 分鐘）：

| 我想… | 連結 |
| --- | --- |
| 🗺️ 報料新地點 | [issues/new?template=01-new-place.yml](https://github.com/playerkousas-rgb/scoutworld/issues/new?template=01-new-place.yml) |
| 🔗 回報死連／過期資料 | [issues/new?template=02-outdated-info.yml](https://github.com/playerkousas-rgb/scoutworld/issues/new?template=02-outdated-info.yml) |
| ✏️ 修正建議 | [issues/new?template=03-correction.yml](https://github.com/playerkousas-rgb/scoutworld/issues/new?template=03-correction.yml) |

貢獻前先讀 [CONTRIBUTING.md](CONTRIBUTING.md)——核心一條：**準確 > 數量**，
每個地點必須有可以親自查證嘅來源網址。

## 技術

- 純前端：單一 `index.html`（Leaflet 地圖 + Tailwind），Vercel 靜態託管，PWA 離線可用
- 資料：`data/<region>/local/<COUNTRY>.json`（L3/L4）＋ `data/search-index.json`（由
  `python3 tools_search_index_build.py` 重建）
- 路線圖：[ROADMAP_2026.md](ROADMAP_2026.md)
- 資料品質檢查：`python3 tools_data_quality.py`（只檢查靜態 JSON，不會連線或上傳資料）；GitHub Actions 亦會在資料變更時自動執行

## 海外正式聯絡

Scout World 只係出發前資料參考，唔係正式海外聯絡渠道；以香港童軍名義嘅
海外訪問、交流或聯絡，請跟香港童軍總會國際署程序。
