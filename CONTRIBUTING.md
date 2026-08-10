# 貢獻指南 Contributing to Scout World

Scout World Explorer 係一個幫**香港童軍出發前做資料搜集**嘅開源資料庫——
探訪海外童軍單位、買童軍用品、訂營地，一站搵齊。
個網站值錢嘅地方唔係介面，而係**資料量 × 準確度**。
所以你嘅每一單報料、每一個死連回報，都係直接幫下一位出發嘅童軍慳時間、避伏位。🙏

網站：https://scoutworld.vercel.app/　|　資料政策：[DATA_POLICY.md](DATA_POLICY.md)

---

## 三種貢獻方式

| 我想… | 用邊個表格 | 連結 |
| --- | --- | --- |
| 報料新地點（總部／用品店／營地／博物館） | 🗺️ 報料新地點 | [開 issue](https://github.com/playerkousas-rgb/scoutworld/issues/new?template=01-new-place.yml) |
| 回報死連／網站被騎劫／資料過期 | 🔗 回報死連・過期資料 | [開 issue](https://github.com/playerkousas-rgb/scoutworld/issues/new?template=02-outdated-info.yml) |
| 翻譯、分類、介面等一般建議 | ✏️ 修正建議 | [開 issue](https://github.com/playerkousas-rgb/scoutworld/issues/new?template=03-correction.yml) |

識 JSON 嘅話，亦可以直接開 Pull Request 改 `data/**/local/*.json`（格式見下文）。

---

## 收錄鐵律：準確 > 數量

我哋情願少一個地點，都唔好累人按錯資料出錯醜。所以：

1. **每個地點必須有一個可以親自查證嘅來源網址**（`verificationSource`，單一 URL）。
   冇來源嘅報料會被禮貌哂謝，唔會收錄。
2. **來源有等級**，越高等越好：

   | 等級 | 例子 |
   | --- | --- |
   | 🥇 官方 | 童軍總會官網、政府註冊名冊、場地官方網站 |
   | 🥈 官方社交 | 官方 Facebook／Instagram 專頁（有專頁認證更佳） |
   | 🥉 第三方 | 傳媒報道、學校公文、政府採購公告 |
   | 旅行 blog | 只作輔助，唔會單獨作為收錄依據 |

3. **查證唔到就照實標**——例如 `unverified 2026-08-10`，等用家自己判斷。
   寧願誠實標明未核實，都唔好扮確認。
4. **安全優先**：官方域名如確認被騎劫（跳轉賭博／spam），我哋會移除連結並加警告，
   詳見 [DATA_POLICY.md](DATA_POLICY.md) 嘅域名安全覆核規則。

## 乜嘢唔收

- 冇任何可查證來源嘅地點（包括「聽講」「見過」而冇網上紀錄）
- 純商業推廣或廣告
- 私人住宅地址
- 已經結業且冇歷史價值嘅地點（歷史聖地如日 shambles 營會場址會標明歷史性質收錄）

## （進階）直接改 JSON

資料檔喺 `data/<region>/local/<COUNTRY>.json`。每個地點最少要有：

```jsonc
{
  "id": "XX-CAMP-EXAMPLE",            // 國碼-類型-名稱，全大寫
  "name": "那須野営場",                 // 原文名稱
  "nameEn": "Nasu Scout Camp",        // 英文（供搜尋）
  "type": "營地",
  "address": "栃木縣那須塩原市…",
  "lat": 36.9, "lng": 139.9,          // 非精確位置要加 locationAccuracy
  "verificationSource": "https://…",  // 單一 URL，我哋會真係開嚟睇
  "verificationStatus": "official; verified 2026-08-10"
}
```

規則三條，詳見 DATA_POLICY.md：

1. `verificationSource` 必須係**單一 URL**；次要來源寫入 `verificationStatus` 文字並標明等級。
2. 官方連結確認被騎劫 → **移除 website 連結**＋警告；純粹連唔通（5xx）→ 保留連結＋「出行前覆核」警告。
3. 新增國家碼之前，記得喺 `index.html` 嘅 `countryRegionMap` 註冊，否則 L3 資料會 404。

改完記得行 `python3 tools_search_index_build.py` 重建搜尋索引。

## 海外正式聯絡

Scout World 只係出發前資料參考，**唔係正式海外聯絡渠道**。
以香港童軍名義嘅海外訪問、交流或聯絡，請跟香港童軍總會國際署程序辦理。
