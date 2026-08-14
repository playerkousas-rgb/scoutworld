# Africa 非洲區年度覆審（第三批）

日期：2026-08-14

## 覆審範圍

掃描 `data/africa/region.json` 及 42 個國家／地區的 `local/*.json`。

| 項目 | 數量 |
|---|---:|
| L2 國家／地區 | 42 |
| L3/L4 地點 | 55 |
| 有 website | 21 |
| 有 address | 55 |
| 有 verificationSource | 53 |
| 有 lastReviewed | 13 |
| 有 visitorNote | 0 |
| 有 bookingUrl | 0 |

## 本批結果

- 沒有發現資料結構錯誤。
- 所有條目都有地址；大部分資料屬國家總部及聯絡入口。
- 2 個沒有 `verificationSource` 的條目屬肯亞 Shop 及 Rowallan Camp；原來源網域曾被騎劫，已用 `removed-hijacked-domain` 安全狀態標記。
- 肯亞總部改用 WOSM 非洲區名錄作安全來源；Shop 及 Rowallan Camp 在找到足以支持個別地點的可靠來源前維持 warning。
- 安哥拉及剛果共和國的被騎劫網域亦已從所有可點擊 URL 欄位移除，改保留 WOSM 來源及安全警告。
- 非洲資料目前沒有 `visitorNote` 或 `bookingUrl`；不能因此推算營地不開放或不需預約。
- 已有覆核日期的 13 個條目保留實際日期，其餘不以資料庫整理日期代替。

## 使用者提示

非洲資料主要提供國家總部、營地及用品資訊入口。由於部分國家官方網站及公開接待資料有限，出發前必須直接向原始來源確認地址、開放、預約及安全安排。
