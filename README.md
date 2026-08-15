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
