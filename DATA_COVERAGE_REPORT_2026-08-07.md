# Scout World Explorer — 地方資料覆蓋率報告
**生成日期：2026-08-07** ｜ 生成方式：`python3 tools_search_index_build.py` + 覆蓋率審計

## 🎯 目的

回答用家問題：「揀咗一個國家，入面有幾多嘢睇？」
今次審計覆蓋 **173 個 WOSM 成員國/地區** + 香港（L4 細分）+ 世界資源層。

## ✅ 好消息

- **0 個國家完全無地方資料檔案** —— 所有 173 個 WOSM 成員都有 `local/*.json`，揀邊個國家都開到資料。
- **資料質素乾淨**：缺座標 0 項、缺類型 0 項、缺來源 0 項（承 Phase 1 清理成果）。
- 地方地點總數：**1,106 項**（2026-08-07 第3波後）（橫跨 175 個代碼）。

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

---

## 🚀 官方來源豐富化第 1 波（2026-08-07 完成）

原則：**每條新資料必須有官方來源 URL 佐證，寧缺勿濫**。所有新條目均附 `verificationSource`（官方頁面直鏈），座標凡非精確位置必附 `locationAccuracy` 代表點聲明。

| 國家 | 前 → 後 | 新增內容 | 官方來源 |
|---|---|---|---|
| 🇹🇭 泰國 TH | 1 → **5** | 4 大國家直屬營地：哇集拉兀營地（全國大露營主會場）、皇家慶典營地（董里）、皇家班萊營地（叻丕）、叻他沙叻營地（宋卡） | scoutthailand.org 官方營地頁 camp.php（逐頁確認） |
| 🇰🇷 韓國 KR | 2 → **13** | 8 個地方連盟（首爾北/南、釜山、大邱、仁川、京畿南、江原、濟州）、中央訓練院（高陽）、江原世界大露營修練場（1991 WSJ 會場）、官方網店 | scout.or.kr 官方連盟目錄（22連盟）+ 大露營官方頁 + 官網商店直鏈 |
| 🇯🇵 日本 JP | 11 → **14** | 千葉、兵庫、沖繩童軍會（附官方頁列明電話） | find-local.scout.or.jp 逐頁確認 |
| 🇸🇬 新加坡 SG | 6 → **7** | 東區議會（補齊四大區） | scout.sg Scout Council 官方頁 |

- 地方地點總數：**1,077 → 1,096**（+19）
- 澳門：當日官網連線失敗無法核實，**按準確原則暫不新增**，待官方來源可達後補。

## 🚀 官方來源豐富化第 2 波（2026-08-07 完成）— 亞太區收尾

| 國家 | 前 → 後 | 新增內容 | 來源級別 |
|---|---|---|---|
| 🇵🇭 菲律賓 PH | 2 → **6** | 馬麒麟山國家大露營場地（**1959 年第 10 屆世界大露營——亞洲首次 WSJ**）、達沃 Malagos 營地、NCR 地區辦事處（官方聯絡頁）、官方 Shopee 網店（官方 FB 直鏈） | 辦事處/網店 = 官方；營地 = 多重二手佐證，已標記 |
| 🇱🇰 斯里蘭卡 LK | 2 → **4** | Lake View Park 國際童軍中心（康提，仿 Gilwell 建）、Lee Dassanayake 活動中心（米里加馬）；柏多營地與原有條目去重 | 業主校友會官網 + Wiki 二手，已標記 |
| 🇳🇵 尼泊爾 NP | 2 → **3** | Sundarijal 國家訓練中心（加德滿都） | 二手文獻，已標記 |

- 地方地點總數：**1,096 → 1,103**（+7）
- 重複去重：LK-CAMP-PEDRO（保留原有含官方 FB 的更佳條目）
- 馬來西亞：官網未有公開營地清單可核實，按準確原則本波不新增
- 亞太小島國/中亞（AF BT KH KI KZ MM MN MV PG PK RU SB TJ TL）保留單一 HQ 條目——官方公開資料稀缺，唔做估估下嘅填充

## 🚀 官方來源豐富化第 3 波（2026-08-07 完成）— 歐洲區開展：英國 GB

英國係香港童軍外遊歐洲第一站。今波目標：**補齊全英 Scout Adventures 官方活動中心名單 + 官方小組探訪工具**。

| 國家 | 前 → 後 | 新增內容 | 官方來源 |
|---|---|---|---|
| 🇬🇧 英國 GB | 13 → **16** | **Lochgoilhead**（Scouts Scotland 三大全國中心之一，Loch Lomond 國家公園水上歷奇）、**Meggernie**（Perthshire Glen Lyon 高地露營營地）、**全英小組搜尋**（官方 Find your local Scout Group，全英超過 7,500 個小組，香港旅團探訪英國單位第一步） | scoutadventures.org.uk 官方中心頁（逐頁確認電話/地址）＋ scouts.scot/outdoor-centres ＋ scouts.org.uk/groups |

### ⚠️ 審計中發現嘅過時資訊（結論：**不納入**，免誤導）
- **Hawkhirst Scout Adventures（英格蘭北部 Kielder）已於 2025-03-31 停止運作**（scouts.org.uk 2024-11 官方公告）。
- **Downe 活動中心** 2021 年關閉、2024-10 售予 Friends of Downe Activity Centre，已非 TSA 旗下。
- **Woodhouse Park** 已交還 Avon Scouts 營運。
- 對照官方 **Scout Adventures「All Centres」現行名單共 9 中心**（Gilwell、Broadstone Warren、Youlbury、Great Tower、Yr Hafod、Crawfordsburn、Fordell Firs、Lochgoilhead、Meggernie）——本站 GB.json 現已 **9/9 全齊** ✅。
- **Blair Atholl 蘇格蘭國際小隊大露營**：官方活動專網今次無法連通、scouts.scot 相關頁面 404，為免引用過時二手資料，**按準確原則暫緩收錄**，待官方渠道可達後補。

- 地方地點總數：**1,103 → 1,106**（+3）；搜尋索引 **1,326** 條。

## 🚀 官方來源豐富化第 4 波（2026-08-08 完成）— 歐洲：法/德/瑞「搵本地童軍團」官方入口

瑞士 CH、法國 FR、德國 DE、北歐（DK/NO/SE/FI）、奧地利 AT、愛爾蘭 IE 逐國做 completion-check 後發現：**北歐／AT／IE 已相當齊全**（官方全國中心、用品社、區會、團隊搜尋都已有條目），真正缺口係三大熱門旅遊國未收錄「按地圖搵本地單位」嘅官方工具——而呢啲正係香港旅團「事前搵探訪對象」最實用嘅一類。

| 國家 | 前 → 後 | 新增內容 | 官方來源 |
|---|---|---|---|
| 🇨🇭 瑞士 CH | 14 → **15** | **Pfadi-Finder** 全國童軍團地圖（官方：全國 534 個本地團、51,000 成員） | pfadi.swiss/en/go/joining-scouts（PBS 官方） |
| 🇩🇪 德國 DE | 12 → **13** | **DPSG Stammessuche** 全國支部搜尋地圖（全國最大天主教童軍會，rdp 體系最大成員） | dpsg.de/de/die-dpsg/dpsg-vor-ort（DPSG 官方） |
| 🇫🇷 法國 FR | 11 → **12** | **SGDF 小組地圖**「Trouvez un groupe」（法國最大童軍會，863 個本地小組） | sgdf.fr/nous-rejoindre（SGDF 官方，內嵌全國地圖） |

### ⚠️ 核實過程備忘（不納入／待覆查）
- **瑞士 Roverway 2028**：PBS 官方頁確認 2028 年瑞士首次主辦歐洲 Roverway（16–22 歲），但**營地場址尚未選定**（官方「We are looking for a campsite!」），無法給出準確座標 → 暫不收錄為地點，待官方公佈場址後補。
- 德國 DPSG kunterBLAU 2026 聯合大露營：已屆（2026 年夏季），不作新增地點；DPSG Bundessommerlager 2029 待場址細節公佈。
- 丹麥 DK：spejder.dk 現為 DDS 主網站，原有 4 中心 + 2 用品社已覆蓋主要官方渠道，暫不增加。

- 地方地點總數：**1,106 → 1,109**（+3）；搜尋索引 **1,329** 條。
