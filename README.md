# Scout World Explorer 🌍⚜️

幫**香港童軍出發前做資料搜集**嘅互動世界地圖——探訪海外童軍單位、
買童軍用品、訂營地，一站搵齊。

**Live site: https://scoutworld.vercel.app/**

## 呢個係咩

唔係行程規劃工具，而係一個**資料庫**——價值在於資料量 × 準確度：

| 層級 | 內容 | 規模（2026-08-10） |
| --- | --- | --- |
| L2 | WOSM 會員國／地區總會 | 223（176 個 WOSM 會員全覆蓋＋SCENES 45） |
| L3/L4 | 各地總部、用品店、營地、博物館、區會 | **1,141** 個地點、178 個國家／地區碼 |

每個地點都帶查證來源同核實狀態；未核實嘅會誠實標明。
資料政策見 [DATA_POLICY.md](DATA_POLICY.md)；逐波擴展嘅審計紀錄見
[DATA_COVERAGE_REPORT_2026-08-07.md](DATA_COVERAGE_REPORT_2026-08-07.md)。

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

## 海外正式聯絡

Scout World 只係出發前資料參考，唔係正式海外聯絡渠道；以香港童軍名義嘅
海外訪問、交流或聯絡，請跟香港童軍總會國際署程序。
