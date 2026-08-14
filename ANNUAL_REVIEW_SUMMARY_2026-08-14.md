# Scout World 年度覆審總結（2026-08-14）

## 覆審批次

| 批次 | 範圍 | 報告 |
|---|---|---|
| 1 | Asia-Pacific 亞太區 | `REVIEW_ASIA_PACIFIC_2026-08-14.md` |
| 2 | Europe 歐洲區 | `REVIEW_EUROPE_2026-08-14.md` |
| 3 | Africa 非洲區 | `REVIEW_AFRICA_2026-08-14.md` |
| 4 | Interamerica 美洲區 | `REVIEW_INTERAMERICA_2026-08-14.md` |
| 5 | Arab＋World／SCENES | `REVIEW_ARAB_WORLD_2026-08-14.md` |

## 覆審總原則

- 這是公開參考資料庫，不是官方實時名錄。
- 網站可連線只代表網址有回應，不代表開放時間、收費、預約或訪客安排沒有變動。
- 沒有 `visitorNote` 不代表不開放；沒有 `bookingUrl` 不代表不需預約。
- 沒有精確地址時保留代表點及 `locationAccuracy` 說明，不自行猜測。
- 被騎劫的來源必須移除並保留安全狀態，不重新加入危險連結。
- 沒有實際覆核日期時，不用資料庫整理日期代替。

## 結果

- 五大區覆審報告全部完成。
- Asia-Pacific、Europe、Africa、Interamerica 及 Arab／World／SCENES 均完成資料結構及欄位盤點。
- 已有個別覆核日期的資料保留 `lastReviewed`。
- 欠缺開放、預約或最新營業資料的條目繼續以不確定狀態呈現。
- 資料品質檢查及 JavaScript runtime test 均已納入 GitHub Actions。
- 月度連線檢查會標記明顯死連，但不會自動判斷網站內容是否正確。

## 後續維護

1. 每月自動檢查來源網址。
2. 發現明顯死連後人工查看報告。
3. 由可靠原始來源補充 Scout Shop、營地及總部資料。
4. 有實際覆核證據才更新 `lastReviewed`。
5. 成員可透過 APP 直接打開原始來源，自行確認出發前安排。
