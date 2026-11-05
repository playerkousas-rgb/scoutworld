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
  分類標籤、日期格式，以及 `<title>`、meta description、Open Graph。
- **保持原文**：地點簡介（`description`）、地址、查證狀態等**資料內容**。
  英文模式會喺詳情頁老實標明「簡介以中文原文提供，未經翻譯」，唔會偷雞機翻，
  守住「準確 > 數量」。
- **點加翻譯**：介面字典集中喺 `index.html` 嘅 `EN`（純文字）同 `EN_HTML`
  （含 `<strong>`／`<a>` 嘅段落）。key 就係中文原文，值係英文；有插值用
  `{name}`，例如 `tr('共 {n} 個地點', { n: 12 })`。新增任何中文界面字都要補英文，
  `npm run test:i18n` 會掃描靜態 HTML、`title`／`aria-label` 同所有 `tr()`
  呼叫，列出漏譯或者空字串。

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
