# ⚜️ Scout World Explorer — WOSM Global Directory

### 香港童軍外遊規劃首選 | 全球童軍總部・營地・用品社資料庫

🌐 **正式網址：[https://scoutworld.vercel.app/](https://scoutworld.vercel.app/)**

專為香港童軍而設：**出發前計劃「到外地探訪童軍單位、購買用品、預訂露營」**的一站式規劃工具。資料 100% 來自 [scout.org](https://www.scout.org/) WOSM 官方成員頁面，直接對照原始來源。本專案為重構優化版：**放棄多語言繁重欄位，並將資料分區域（Region）儲存於不同 JSON 檔案中**，以大幅減輕載入負擔，並使日常維護更加清晰、直覺！

---

## 🆕 2026-08 大改版：規劃體驗全面升級

*   🔥 **熱門目的地捷徑**：日本・台灣・韓國・新加坡・泰國・澳洲・英國（基維爾）・瑞士（KISC）一撳直達。
*   🌍 **全球地點搜尋**：內建 1297+ 條索引（`data/search-index.json`），輸入 `KISC`、`東京`、`Shop` 即時直達任何營地／用品社／區會，輸入兩個字自動生效。
*   🔗 **目的地分享連結**：每個國家／組織都有專屬網址（如 `scoutworld.vercel.app/#GB`），詳情頁「分享」掣一鍵複製或經 WhatsApp／Telegram 直送團友；朋友打開即直達。
*   📴 **PWA 離線模式**：Service Worker（`sw.js`）快取 App 外殼、資料 JSON 及地圖圖磚——**出發前睇過嘅資料，旅途中斷網都睇得返**；可「加入主畫面」當 App 用。
*   ✈️ **外遊規劃五部曲**：工具箱升級為「揀目的地 → 辦手續（國際署 ILI）→ 訂營地 → 查用品社 → 執手信」完整流程，附 1868 熱線、外遊警示等應急資訊。
*   🔍 **SEO 全面補完**：meta description、Open Graph／Twitter 分享卡（1200×630）、JSON-LD 結構化資料、favicon、`robots.txt`、`sitemap.xml`、canonical —— Google 搵「童軍外遊」「KISC 營地」搵得到！

---

---

## ⚡ 專案特色

*   🚀 **極速載入**：摒棄單一巨大的 `scouts.json`，拆分為多個區域 JSON 文件，按需載入。
*   🧹 **簡化結構**：放棄繁複的多國語言模式，改用單一簡潔、高可讀性的中文/英文混排欄位，大幅降低資料體積。
*   🗺️ **免費互動地圖**：採用完全免費的 **OpenStreetMap (Leaflet)**，免 API Key、免付費、無用量限制。
*   🔍 **強大搜尋與篩選**：支援國家名、組織名、英文縮寫之即時搜尋，與六大洲/區域快速篩選。
*   📱 **極佳行動端體驗**：專為旅行、外訪童軍設計，支援一鍵撥打電話、一鍵發送電郵、一鍵在 Google Maps 搜尋總部。
*   💰 **零維護成本**：無後端、無資料庫、免 API Key，$0 元即可部署於 GitHub 與 Vercel。

---

## 📁 檔案結構

```text
scout-world-explorer/
├── index.html              ← 互動主程式（單一 HTML / JS / CSS 文件，包含 Leaflet 地圖）
├── sw.js                   ← PWA Service Worker（離線快取：外殼/資料/地圖圖磚）
├── manifest.webmanifest    ← PWA 安裝描述檔（加入主畫面）
├── robots.txt              ← 搜尋引擎爬蟲指引
├── sitemap.xml             ← 網站地圖（SEO）
├── favicon.ico / *.png     ← 圖標（32px / Apple 180px / PWA 192·512px）
├── og-cover.jpg            ← 1200×630 社交媒體分享卡
├── tools_search_index_build.py ← 全球地點搜尋索引生成器（改完 data 後執行）
├── tools_link_check.py     ← 連結健康檢查工具
├── vercel.json             ← Vercel 路由與靜態快取設定
├── README.md               ← 專案說明文件
└── data/
    ├── search-index.json   ← 全球地點搜尋索引（自動生成，勿手改）
    ├── local/
    │   └── HK.json         ← 🇭🇰 香港本地細分（自成一家，5大地域 + 44區會 + 營地）
    ├── africa/
    │   ├── region.json     ← 非洲區大綱（7國）
    │   └── local/          ← 各國本地細分（如有）
    ├── americas/
    │   ├── region.json     ← 美洲區大綱（11國）
    │   └── local/          ← 各國本地細分
    ├── arab/
    │   ├── region.json     ← 阿拉伯區大綱（8國）
    │   └── local/          ← 各國本地細分
    ├── asia-pacific/
    │   ├── region.json     ← 亞太區大綱（20國，HK除外）
    │   └── local/          ← 各國本地細分
    └── europe/
        ├── region.json     ← 歐洲區大綱（20國）
        └── local/          ← 各國本地細分
```

### 分區維護，互不干擾

每一區可獨立更新，唔怕改錯其他區嘅 data：

| 資料夾 | 涵蓋國家 | 本地細分 |
|--------|---------|---------|
| `data/local/` | 香港 🇭🇰（獨立） | 5地域 + 44區會 + 營地 + 用品社 |
| `data/africa/` | ZA, KE, GH, NG, ET, TZ, CM | 7國實例 |
| `data/americas/` | US, CA, BR, AR, MX, CL, CO, VE, CR, GT, DO | 各地營地/區會 |
| `data/arab/` | SA, EG, AE, MA, JO, TN, LB, QA | 各地營地/區會 |
| `data/asia-pacific/` | ID, JP, KR, SG, TW, AU, NZ, MY, PH, IN, BD, LK, TH, VN, MN, KH, MM, NP, MO | 16國有本地細分 |
| `data/europe/` | GB, FR, DE, SE, NO, FI, DK, NL, BE, CH, IT, ES, PL, IE, PT, CZ, EE, AT, GR, HU | 20國有本地細分 |

---

## 🚀 部署指南（只需 3 步驟）

### 1. 建立並推送至 GitHub
在本地專案目錄下執行：
```bash
git init
git add .
git commit -m "⚜️ Scout World Explorer - Reconstructed"
git remote add origin https://github.com/YOUR_USERNAME/scout-world-explorer.git
git push -u origin main
```

### 2. 匯入至 Vercel
1. 登入 [Vercel 官網](https://vercel.com)。
2. 點擊 **Add New Project** → **Import Git Repository**。
3. 選擇您剛才建立的 `scout-world-explorer` 倉庫。

### 3. 一鍵部署
*   **Framework Preset**: 選擇 `Other`
*   **Root Directory**: 保持預設 `/`
*   點擊 **Deploy** 即可在數秒內上線！

---

## ➕ 如何新增 / 更新組織資料

如需新增或修改組織，只需打開 `data/` 資料夾中對應區域的 JSON 檔案（例如：`data/asia-pacific/region.json`），並參照以下格式修改：

```json
{
  "id": "MY",
  "flag": "🇲🇾",
  "country": "馬來西亞",
  "countryEn": "Malaysia",
  "org": "PPM",
  "orgFull": "馬來西亞童軍總會 (Persekutuan Pengakap Malaysia)",
  "wosmRegion": "Asia-Pacific",
  "founded": 1910,
  "members": 500000,
  "lat": 3.1390,
  "lng": 101.6869,
  "address": "Rumah Pengakap, Jalan Hang Jebat, Kuala Lumpur, Malaysia",
  "phone": "+60 3 20 78 08 36",
  "website": "https://www.scouts.my",
  "email": "",
  "contactPolicy": "正式海外探訪、交流、活動申請或以香港童軍身份與海外童軍組織通訊，須按香港童軍總會程序經總會國際署處理／轉介（國際署電話：2957 6400）。個人旅行期間查閱公開資訊、參觀公開開放地點或到 Scout Shop 購物，請自行按當地公開安排確認；社交平台只作資訊及國際友誼交流，並非正式聯絡渠道。本站不提供海外官方電郵。",
  "wosmSource": "https://www.scout.org/where-we-work/regions/asia-pacific/countries"
}
```

### 💡 實用小秘訣：
*   **改完任何 `data/**/*.json` 後**，記得重新生成全球搜尋索引，否則新地點唔會出現喺搜尋結果：
    ```bash
    python3 tools_search_index_build.py
    ```
*   **WOSM 官方來源**：
    *   亞太區：[https://www.scout.org/where-we-work/regions/asia-pacific/countries](https://www.scout.org/where-we-work/regions/asia-pacific/countries)
    *   歐洲區：[https://www.scout.org/where-we-work/regions/europe/countries](https://www.scout.org/where-we-work/regions/europe/countries)
    *   美洲區：[https://www.scout.org/where-we-work/regions/interamerica/countries](https://www.scout.org/where-we-work/regions/interamerica/countries)
    *   阿拉伯區：[https://www.scout.org/where-we-work/regions/arab/countries](https://www.scout.org/where-we-work/regions/arab/countries)
    *   非洲區：[https://www.scout.org/where-we-work/regions/africa/countries](https://www.scout.org/where-we-work/regions/africa/countries)
*   **取得精準座標 (Lat/Lng)**：
    在 Google Maps 搜尋該童軍組織名稱，右鍵點擊地圖上的紅點，即可直接複製緯度與經度（例如：`3.1390, 101.6869`）。

---

## 📢 意見反饋與貢獻

本專案致力於打造「童軍 WIKI」，讓所有想去海外旅行或交流的童軍都能在此找到最實用的資訊。

如果您有任何建議或發現資料錯誤，歡迎聯繫：
請使用 GitHub Issues 或專案維護渠道提交意見。


## 聯絡政策補充（個人旅行 vs 正式訪問）

- 正式海外探訪、交流、活動申請或以香港童軍身份與海外童軍組織通訊，須按香港童軍總會程序經總會國際署處理／轉介。
- 個人旅行期間查閱公開資訊、參觀公開開放地點或到 Scout Shop 購物，不等同正式訪問；請按當地公開安排自行確認開放時間、預約或入場規則。
- Facebook、Instagram、YouTube 等社交平台可保留作資訊及國際友誼交流渠道，但不是正式聯絡渠道。
