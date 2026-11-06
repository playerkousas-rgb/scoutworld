# 部署瘦身守則

這個專案是無建置步驟的靜態網站；Vercel 的部署根目錄就是 repository root，不能把 `data/` 或根目錄的 runtime 資產移出。請以「不改變瀏覽器可見功能」為最高原則。

## 每次改版前

- 先執行 `npm run check`（包含語法檢查、runtime 測試和靜態產物驗證）。
- 新增圖片、字型或資料前，確認它有被 `index.html`、`sw.js`、`manifest.webmanifest` 或程式碼引用；沒有引用的展示圖、截圖、設計原稿不得進 repository。
- 不要提交 `node_modules/`、`.vercel/`、`dist/`、`build/`、`.cache/`、`coverage/`、`__pycache__/`、上傳資料夾或 `*.bak` / `*.tmp` / `*.old` / `*.log`。
- 只將瀏覽器執行所需的 HTML、JS、CSS、圖片、manifest、service worker 和 `data/` 資料部署；開發工具、測試檔和報告由 `.vercelignore` 排除。
- 依賴應保持最少。純靜態 runtime 不得新增 `dependencies`；只在檢查或建置用的工具放 `devDependencies`。
- 圖標跟 house standard G11（[`readme/docs/33`](https://github.com/playerkousas-rgb/readme/blob/main/docs/33-icon-standard.md)）：只准 PNG／ICO 共 9 個檔（`favicon.ico`、`favicon-16`、`favicon-32`、`apple-touch-icon`、`icon-192`、`icon-512`、2 個 `maskable`、`og-image.png`），**合共 ≤ 260 KB**，唔准 SVG／WebP／AVIF，亦唔准 1024×1024。改圖標要跑 `npm run test:icons`；換圖後要通知已安裝 PWA 嘅用戶刪咗再裝一次。
- 翻譯只可以加喺 `index.html` 內嘅 `EN` / `EN_HTML` 字典，唔可以為每種語言複製一份 HTML 或者一份 `data/`（否則改 bug 要改幾次，亦會令部署大一倍）。加完翻譯要跑 `npm run test:i18n`。

## 變更後驗收

```sh
npm run check
```

若改動介面（HTML／CSS／圖標），除咗 `npm run check`，仲要人手喺 390 / 768 / 1440 三個闊度望一次（呢個環境冇瀏覽器，AGENT 一定要講明做唔到，唔可以扮做咗）。

若修改資料產生器，額外確認 `data/search-index.json` 和 `data/place-counts.json` 已重新生成，並檢查 service worker 的 precache 清單仍與檔案名稱一致。不要為了節省少量空間刪除任何仍被 manifest、service worker 或 HTML 引用的圖示。

`.vercelignore` 是部署邊界的單一明確紀錄；若日後新增 runtime 資產，必須同步檢查它沒有被忽略。Vercel 不應配置不存在的 build output directory，避免把整個開發環境誤當成產物。
