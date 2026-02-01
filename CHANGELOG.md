# 更新日誌 (2026-02-01)

## 🛠️ 問題修復 (Deployment & UI)

### 1. 部署 404 錯誤修復 (GitHub Pages)
- **原因**：原本的 `data` 資料夾位於根目錄，Vite 在構建生產版本時不會自動將其包含在 `dist` 包中。
- **修復**：
  - 將 `data` 資料夾遷入 `public/data`。
  - 更新 `scripts/generate-index.js` 索引生成邏輯。
  - 在 `reportStore.js` 與 `ReportView.vue` 加入 `import.meta.env.BASE_URL` 動態路徑，確保在 GitHub Pages 子路徑 (`/investAi/`) 下能正確讀取資源。

### 2. UI 套件與樣式修復
- **圖示顯示**：補上缺失的 `primeicons/primeicons.css` 引入。
- **Tailwind v4**：更新 `style.css` 語法以符合 Tailwind CSS v4 規範，並連結全域設定。
- **排版優化**：啟用 `@tailwindcss/typography` 確保 Markdown 報告內容渲染美觀。

## ✨ 功能與交互優化

### 1. 介面調整
- **返回功能**：在報告詳情頁面新增「返回報告列表」按鈕。
- **標籤配置**：首頁分類標籤支援自動換行（Wrap），移除多餘的水平捲軸。
- **GitHub 連結**：移除導覽列右側重複的 GitHub 連結。
- **捲軸美化**：新增自定義全域捲軸樣式，支援深色模式切換。

### 2. 交互特效 (Hover Effects)
- 為所有按鈕（分類、返回、連結）添加了 `hover` 縮放、陰影與顏色轉換效果。
- 導覽列 Logo 新增 `hover` 旋轉與微縮放動效。
- 麵包屑導覽新增 `hover` 底線提示。

## 📝 程式碼整理
- 為 `main.js`、`reportStore.js` 及所有 `vue` 組件添加了詳細的中文註解說明。
- 執行專案清理，確保構建過程（Build process）無誤。
