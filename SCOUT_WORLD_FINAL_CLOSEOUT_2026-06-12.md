# Scout World Final Closeout — 2026-06-12

## 專案狀態總結

Scout World 目前已完成可供 Git / Vercel 測試及後續維護的精簡交付版。此版本目標是讓香港童軍成員在外遊或海外旅行前，可以快速查閱可靠公開童軍資訊，包括：

- WOSM 成員組織 / NSO / NSA
- 官方網站及公開資料來源
- 官方或可靠公開社交資訊渠道
- Scout Shop
- 營地 / training centre / scout centre
- group finder / local finder / 地區網絡入口
- 香港 L4 地域及 44 區會
- WOSM / World Scouting 全球資源層：World Scout Bureau、KISC、SCENES、WOSM Services、JOTA-JOTI、World Scout Foundation

正式海外探訪、交流、活動申請或以香港童軍身份與海外童軍組織通訊，仍須按香港童軍總會程序經總會國際署處理／轉介。本站不公開海外官方電郵。

---

## 最終資料統計

| 區域 / layer | L2 / top entries | Local / resource entries | verificationSource | pending |
|---|---:|---:|---:|---:|
| Asia-Pacific | 33 | 129 | 129/129 | 0 |
| Europe | 47 | 673 | 673/673 | 0 |
| Americas / Interamerica | 35 | 50 | 50/50 | 0 |
| Arab | 19 | 35 | 35/35 | 0 |
| Africa | 39 | 50 | 50/50 | 0 |
| Hong Kong L4 local | — | 59 | 59/59 | 0 |
| Global resources | 1 | 7 | 7/7 | 0 |
| **Total** | **174** | **1003** | **1003/1003** | **0** |

全資料總 entries（L2 + local/resource）：1177。

---

## 已完成的主要工作

### 1. 五大區 L1 / L2 / L3 基線

- Asia-Pacific、Europe、Americas、Arab、Africa 五大區已建立 WOSM L2 基線。
- L2 以 WOSM official member organization entry 為基礎。
- L3 只保留有來源、有用途、可解釋的資料。
- 無來源、泛稱、估算、wiki-only 資料已清理。

### 2. 香港 L4

- 香港保留特殊 L4：地域、區會、營地、Scout Shop、國際署等。
- 前端預設載入香港，方便香港成員使用。

### 3. Source cleanup

- 所有 local / resource entries 均已有 `verificationSource`。
- 所有 `pending` status 已清理至 0。
- 代表點已用 `locationAccuracy` 或 verification wording 標示，不誤導為精確聚會地點。

### 4. 不公開海外官方電郵

- 所有 `email` 欄位保持空白。
- 前端不顯示海外官方 email。
- 正式聯絡政策集中放於「童軍外遊規劃工具箱」。

### 5. 社交資訊政策

- Facebook / Instagram / YouTube 保留作資訊渠道及國際友誼交流。
- 不作正式聯絡渠道。
- 未能可靠確認官方 attribution 的 social 不硬加。

### 6. 全球資源層

新增 `🌐 世界資源` tab，包含：

- World Scout Bureau Global Support Centre — Kuala Lumpur
- World Scout Bureau Geneva legal / Europe Support Centre representative point
- Kandersteg International Scout Centre (KISC)
- SCENES global directory
- WOSM Services Platform
- JOTA-JOTI
- World Scout Foundation

重要表述：

- KISC 是 WOSM 官方頁所列 **only recognised World Scout Centre**。
- SCENES 是環境及可持續發展童軍中心的認證／網絡，不代表 WOSM 直屬擁有所有中心。

### 7. UI / UX 完成項

- Badge legend modal。
- L3 filters：全部 / Shop / 營地 / HQ / 有來源 / 需覆核。
- 選國家後地圖只顯示該 L2 + 其 L3 / L4 點。
- 選國家後自動 fit map 到該國／地區相關點。
- L2 顯示國旗、通用童軍徽及 WOSM logo（如有）。
- Drawer close / back button 增強。
- 「國家級童軍組織名稱」改為「WOSM成員組織名稱」。
- Sidebar label 改為「WOSM成員 / 全球資源列表」。
- Feedback / landmark submission footer 已移除。

---

## 最新驗證結果

### Static validation

- JSON parse：通過
- Inline JavaScript syntax check：通過
- Email scan：0 hits
- Coordinates：1177 entries scanned；missing 0；invalid 0

### Link check

最新 link check：

- OK：720
- WARN_BLOCKED：17
- ERROR：33
- BAD_NOT_FOUND：0
- BAD_STATUS：0

說明：

- 目前無硬 404 / bad status。
- 剩餘 ERROR / WARN 主要是官方或有用網站的 SSL、timeout、DNS、server handshake、bot-block 或自動檢查不穩定。
- 這些不是 data pending；只是日後可以定期手動 browser check 的維護項。

---

## 是否仍有 pending 未完成？

### Data pending

沒有。

- local / resource verificationSource：1003/1003
- pending：0
- email exposure：0
- coordinates missing / invalid：0

### 非阻塞後續維護項

以下不是 blocking pending，但建議日後繼續維護：

1. Vercel / mobile manual UI QA。
2. 定期重跑 link checker，處理真正失效的官方網站。
3. 如日後要擴充 SCENES，可逐個國家加入高價值 SCENES centre，但必須有官方 source。
4. L3 logo 暫未做；如做，只可用 official NSO / camp / shop / WOSM source。
5. 每年做一次資料覆核。

---

## 精簡版 ZIP 內容建議

精簡版 release package 只保留：

- `index.html`
- `vercel.json`
- `README.md`
- `DATA_POLICY.md`
- `ROADMAP_2026.md`
- `SCOUT_WORLD_FINAL_CLOSEOUT_2026-06-12.md`
- `tools_link_check.py`
- `data/`

不包含舊的 phase reports、audit logs、CSV、舊 ZIP 或 `.git`。

---

## 推送建議

1. 解壓精簡版 ZIP。
2. 將內容放入 Git repo。
3. Commit message 建議：

```text
Finalize Scout World data, UI, and global resources layer
```

4. Push 到 GitHub。
5. 等 Vercel deploy 完成後，用手機及 desktop 手動檢查：
   - 香港預設頁
   - 五大區切換
   - `🌐 世界資源` tab
   - 國家 drawer / L3 list / map fit
   - badge legend
   - 童軍外遊規劃工具箱

---

## 結論

目前版本已達到「可交付、可 push、可維護」狀態。資料策略以準確及來源可追溯為先，不追求表面完整；日後只需按同一政策逐步補強即可。
