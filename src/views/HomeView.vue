<template>
  <div class="min-h-screen flex flex-col">
    <NavBar />

    <main class="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl">
      <!-- Header Section -->
      <div class="mb-10 text-center space-y-4">
        <h2 class="text-4xl font-extrabold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400">
          市場分析報告
        </h2>
        <p class="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
          搜尋最新的投資觀點、技術分析與產業趨勢
        </p>
      </div>

      <!-- Controls -->
      <div class="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800">
        <!-- Search -->
        <div class="relative w-full md:w-96 group">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i class="pi pi-search text-slate-400 group-focus-within:text-indigo-500 transition-colors"></i>
          </div>
          <input 
            v-model="store.searchQuery"
            type="text" 
            class="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-zinc-700 rounded-xl leading-5 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
            placeholder="搜尋股票代號或名稱 (例如: 2330)"
          >
        </div>

        <!-- Filter -->
        <div class="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button 
            v-for="cat in store.uniqueCategories" 
            :key="cat"
            @click="store.selectedCategory = cat"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap',
              store.selectedCategory === cat 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-zinc-800 dark:text-slate-300 dark:hover:bg-zinc-700'
            ]"
          >
            {{ cat === 'all' ? '全部' : cat }}
          </button>
        </div>
      </div>

      <!-- Grid -->
      <div v-if="store.loading" class="flex justify-center py-20">
        <i class="pi pi-spin pi-spinner text-4xl text-indigo-600"></i>
      </div>

      <div v-else-if="store.error" class="text-center py-20 text-red-500 bg-red-50 rounded-xl">
        <i class="pi pi-exclamation-circle text-2xl mb-2"></i>
        <p>{{ store.error }}</p>
      </div>

      <div v-else-if="store.filteredReports.length === 0" class="text-center py-20 text-slate-500">
        <i class="pi pi-search text-4xl mb-4 text-slate-300"></i>
        <p>沒有找到符合條件的報告</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ReportCard 
          v-for="report in store.filteredReports" 
          :key="report.id" 
          :report="report" 
          @click="openReport(report)"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useReportStore } from '@/stores/reportStore';
import NavBar from '@/components/NavBar.vue';
import ReportCard from '@/components/ReportCard.vue';

const store = useReportStore();
const router = useRouter();

onMounted(() => {
  store.fetchReports();
});

function openReport(report) {
    // Navigate to report view
    router.push({
        name: 'report',
        params: {
            category: report.category,
            stockId: report.id,
            reportId: report.filePath.split('/').pop().replace('.md', '') || 'index' // extract filename as ID if needed
        },
        query: {
            path: report.filePath
        }
    });
}
</script>
