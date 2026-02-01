import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 報告狀態中心
 * 負責處理報告數據的獲取、篩選與存儲
 */
export const useReportStore = defineStore('report', () => {
  // 核心數據狀態
  const reports = ref([]) // 原始報告列表
  const loading = ref(false) // 載入狀態
  const error = ref(null) // 錯誤訊息

  // 篩選器狀態
  const searchQuery = ref('') // 搜尋關鍵字 (名稱或代號)
  const selectedCategory = ref('all') // 當前選中的分類
  const dateRange = ref({ start: null, end: null }) // 日期篩選範圍

  /**
   * 從後端 API 獲取最新的報告索引 JSON
   */
  async function fetchReports() {
    loading.value = true
    error.value = null
    try {
      const response = await fetch('api/reports.json')
      if (!response.ok) throw new Error('無法取得報告清單')
      reports.value = await response.json()
    } catch (err) {
      error.value = err.message
      console.error('Fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * 計算屬性：從所有報告中提取出不重複的分類
   */
  const uniqueCategories = computed(() => {
    const cats = new Set(reports.value.map(r => r.category))
    return ['all', ...Array.from(cats)]
  })

  /**
   * 計算屬性：根據搜尋、分類與日期條件進行過濾後的報告列表
   */
  const filteredReports = computed(() => {
    return reports.value.filter(report => {
      // 1. 分類過濾
      if (selectedCategory.value !== 'all' && report.category !== selectedCategory.value) {
        return false
      }

      // 2. 關鍵字搜尋 (支援忽略大小寫的名稱或股票代號)
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        const matchName = report.stockName?.toLowerCase().includes(query)
        const matchId = report.id?.toLowerCase().includes(query)
        if (!matchName && !matchId) return false
      }

      // 3. 開始日期篩選
      if (dateRange.value.start) {
          const reportDate = new Date(report.date);
          const startDate = new Date(dateRange.value.start);
          if (reportDate < startDate) return false;
      }
      // 4. 結束日期篩選
      if (dateRange.value.end) {
          const reportDate = new Date(report.date);
          const endDate = new Date(dateRange.value.end);
          if (reportDate > endDate) return false;
      }

      return true
    })
  })

  return {
    reports,
    loading,
    error,
    searchQuery,
    selectedCategory,
    dateRange,
    fetchReports,
    uniqueCategories,
    filteredReports
  }
})
