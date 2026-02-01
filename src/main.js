import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import router from './router'

// 引入全局樣式與圖示庫
import './style.css'
import 'primeicons/primeicons.css'
import 'animate.css'

import App from './App.vue'

const app = createApp(App)

// 使用外掛：狀態管理與路由
app.use(createPinia())
app.use(router)

// 設定 PrimeVue UI 套件與主題
app.use(PrimeVue, {
    theme: {
        preset: Aura, // 使用 Aura 預設主題
        options: {
            darkModeSelector: '.my-app-dark', // 深色模式選擇器
        }
    }
})

app.mount('#app')
