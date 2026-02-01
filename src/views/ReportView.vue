<template>
    <div class="min-h-screen bg-slate-50 dark:bg-zinc-950">
        <NavBar />

        <main class="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-4xl">
            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center py-20">
                <i class="pi pi-spin pi-spinner text-4xl text-indigo-600"></i>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="text-center py-20 text-red-500 bg-red-50 rounded-xl">
                <i class="pi pi-exclamation-circle text-2xl mb-2"></i>
                <p>{{ error }}</p>
                <button @click="$router.push('/')" class="mt-4 text-indigo-600 hover:underline">返回首頁</button>
            </div>

            <!-- Content -->
            <template v-else-if="reportContent">
                <div class="mb-4">
                    <button @click="$router.push('/')"
                        class="group flex items-center gap-2 px-3 py-1.5 -ml-3 rounded-lg text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all font-medium active:scale-95">
                        <i class="pi pi-arrow-left group-hover:-translate-x-1 transition-transform"></i>
                        返回報告列表
                    </button>
                </div>

                <article
                    class="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 animate__animated animate__fadeIn">
                    <!-- Header -->
                    <div
                        class="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                        <div class="flex items-center gap-2 mb-4 text-sm text-zinc-500">
                            <span
                                class="cursor-pointer hover:text-indigo-500 hover:underline transition-all underline-offset-4"
                                @click="$router.push('/')">首頁</span>
                            <i class="pi pi-angle-right text-xs"></i>
                            <span>{{ meta.category }}</span>
                            <i class="pi pi-angle-right text-xs"></i>
                            <span>{{ meta.stockName }} ({{ meta.id }})</span>
                        </div>

                        <h1 class="text-3xl font-bold text-zinc-900 dark:text-white mb-2">{{ meta.id }} {{
                            meta.stockName }}
                            投資分析報告</h1>
                        <div class="flex items-center gap-4 text-sm text-zinc-500">
                            <span class="flex items-center gap-1"><i class="pi pi-calendar"></i> {{ meta.date }}</span>
                            <span
                                :class="meta.sentiment === 'bullish' ? 'text-red-500 bg-red-50 px-2 py-0.5 rounded' : 'text-green-500 bg-green-50 px-2 py-0.5 rounded'"
                                class="flex items-center gap-1 font-medium">
                                {{ meta.sentiment === 'bullish' ? '看多' : '看空' }}
                            </span>
                        </div>
                    </div>

                    <!-- Body -->
                    <div class="p-8">
                        <MarkdownViewer :content="markdownBody" />
                    </div>
                </article>
            </template>
        </main>
    </div>
</template>

<script setup>
/**
 * 報告詳情視圖
 * 根據路由參數載入對應的 Markdown 文件，並呈現詳細內容
 */
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useReportStore } from '@/stores/reportStore';
import NavBar from '@/components/NavBar.vue';
import MarkdownViewer from '@/components/MarkdownViewer.vue';

const route = useRoute();
const store = useReportStore();
const loading = ref(true);
const error = ref(null);
const reportContent = ref('');

const meta = computed(() => {
    // Find metadata from store based on path or ID
    const path = route.query.path;
    const item = store.reports.find(r => r.filePath === path);
    if (item) return item;

    // Fallback to route params
    return {
        category: route.params.category || 'N/A',
        id: route.params.stockId || 'N/A',
        stockName: route.params.stockId || 'Unknown',
        date: 'Loading...',
        sentiment: 'bullish'
    };
});

const markdownBody = computed(() => {
    return reportContent.value;
})

onMounted(async () => {
    const path = route.query.path;
    if (!path) {
        error.value = '無效的報告路徑';
        loading.value = false;
        return;
    }

    // Ensure store is loaded
    if (store.reports.length === 0) {
        await store.fetchReports();
    }

    try {
        const res = await fetch(path);
        if (!res.ok) throw new Error('報告載入失敗');
        const text = await res.text();

        // Manual frontmatter stripping
        const protect = /^---[\r\n\s\S]*?---[\r\n]+/;
        const match = text.match(protect);

        if (match) {
            reportContent.value = text.replace(match[0], '');
        } else {
            reportContent.value = text;
        }
    } catch (err) {
        error.value = err.message;
    } finally {
        loading.value = false;
    }
});
</script>
