import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/report/:category/:stockId/:reportId',
      name: 'report',
      component: () => import('@/views/ReportView.vue')
    }
  ]
})

export default router
