import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useReportStore = defineStore('report', () => {
  const reports = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Filters
  const searchQuery = ref('')
  const selectedCategory = ref('all')
  const dateRange = ref({ start: null, end: null })

  // Actions
  async function fetchReports() {
    loading.value = true
    error.value = null
    try {
      const response = await fetch('api/reports.json')
      if (!response.ok) throw new Error('Failed to fetch reports')
      reports.value = await response.json()
    } catch (err) {
      error.value = err.message
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // Getters
  const uniqueCategories = computed(() => {
    const cats = new Set(reports.value.map(r => r.category))
    return ['all', ...Array.from(cats)]
  })

  const filteredReports = computed(() => {
    return reports.value.filter(report => {
      // Category Filter
      if (selectedCategory.value !== 'all' && report.category !== selectedCategory.value) {
        return false
      }

      // Search Query (Stock Name or ID)
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        const matchName = report.stockName?.toLowerCase().includes(query)
        const matchId = report.id?.toLowerCase().includes(query)
        if (!matchName && !matchId) return false
      }

      // Date Range Filter
      if (dateRange.value.start) {
          const reportDate = new Date(report.date);
          const startDate = new Date(dateRange.value.start);
          if (reportDate < startDate) return false;
      }
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
