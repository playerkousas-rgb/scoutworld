# Scout World Explorer — 地方資料覆蓋率報告
**生成日期：2026-08-07** ｜ 生成方式：`python3 tools_search_index_build.py` + 覆蓋率審計

## 🎯 目的

回答用家問題：「揀咗一個國家，入面有幾多嘢睇？」
今次審計覆蓋 **173 個 WOSM 成員國/地區** + 香港（L4 細分）+ 世界資源層。

## ✅ 好消息

- **0 個國家完全無地方資料檔案** —— 所有 173 個 WOSM 成員都有 `local/*.json`，揀邊個國家都開到資料。
- **資料質素乾淨**：缺座標 0 項、缺類型 0 項、缺來源 0 項（承 Phase 1 清理成果）。
- 地方地點總數：**1,077 項**（橫跨 175 個代碼）。

## ⚠️ 要留意：80 個國家「資料單薄」（≤1 項，多數只得總部）

揀呢啲國家會見到黃色提示「暫時只收錄咗基本資料」，建議用官方活動搜尋規劃。

### 單薄國家清單（按區域，2026-08-07）

| 區域 | 單薄國家（代碼） |
|---|---|
| 非洲 | AO BF BI BW CD CI CM CV ET GA GM GN LR LS MG MU MW MZ NA NE SC SL SN SS ST SZ TD TG ZM ZW |
| 美洲 | AG AR AW BB BR BS BZ DM DO EC GD GT GY HN HT JM LC NI PA PE PY SR SV UY VC VE |
| 阿拉伯 | BH DZ IQ KW LB LY MA MR PS QA SY TN YE |
| 亞太 | AF BT KH KI KZ MM MN MV PG PK RU SB TH TJ TL VN |

### 資料最豐富 Top 10（地點數）

| 國家/代碼 | 地點數 |
|---|---|
| SHOPPING 網購層 | 62 |
| 🇭🇰 HK 香港 | 59（15 地域營地 + 44 區會） |
| 🇹🇼 TW 台灣 | 34 |
| 🇵🇹 PT 葡萄牙 | 26 |
| 🇧🇬 BG 保加利亞 | 25 |
| 🇲🇰 MK 北馬其頓 | 25 |
| 🇵🇱 PL 波蘭 | 24 |
| 🇸🇰 SK 斯洛伐克 | 20 |
| 🇨🇿 CZ 捷克 | 19 |
| 🇹🇷 TR 土耳其 | 18 |

## 🛠️ 今次 UI 強化（2026-08-07）

1. **列表地點徽章**：國家列表每行顯示 `🏕️ N 地點`；≥5 個地點以橙色高亮，一眼分得出豐富 vs 單薄。
2. **Drawer 資料量提示**：
   - 豐富：`✅ 已收錄 N 個地方地點（🏕️ 營地 x・🛒 用品社 y）`
   - 單薄：`⚠️ 此地區暫時只收錄咗基本資料…` 並引導去「搜尋官方活動/大露營」。
3. `data/place-counts.json`（< 4KB）由 `tools_search_index_build.py` 一併生成，PWA 離線快取已包含。

## 📌 後續優先補充建議

按香港童軍外遊熱門度，優先補：**泰國 TH、日本次要地區、韓國 KR、新加坡 SG、澳門 MO、馬來西亞 MY、澳洲 AU 各州、英國 GB 各郡、加拿大 CA 各省**。
補資料後記得跑 `python3 tools_search_index_build.py` 重生索引同數量檔。
