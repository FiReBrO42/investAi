import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { generateReportsIndex } from './scripts/generate-index.js'

// 自定義插件：當 public/data 內容變動時，自動重新生成 index
function reportIndexPlugin() {
  return {
    name: 'report-index-plugin',
    // 伺服器啟動時執行一次
    buildStart() {
      generateReportsIndex()
    },
    // 監控檔案變動
    handleHotUpdate({ file, server }) {
      if (file.includes('public/data')) {
        generateReportsIndex()
        // 通知瀏覽器重新讀取 reports.json (可以觸發頁面刷新或自訂事件)
        // server.ws.send({ type: 'full-reload' }) 
      }
    },
    configureServer(server) {
      // 額外監控 public/data 目錄
      server.watcher.add(path.resolve(__dirname, 'public/data'))
    }
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/investAi/' : '/',
  plugins: [vue(), reportIndexPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}))
