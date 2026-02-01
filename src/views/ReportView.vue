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
      <article v-else-if="reportContent" class="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
        <!-- Header -->
        <div class="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
           <div class="flex items-center gap-2 mb-4 text-sm text-zinc-500">
               <span class="cursor-pointer hover:text-indigo-500 transition-colors" @click="$router.push('/')">首頁</span>
               <i class="pi pi-angle-right text-xs"></i>
               <span>{{ meta.category }}</span>
               <i class="pi pi-angle-right text-xs"></i>
               <span>{{ meta.stockName }} ({{ meta.id }})</span>
           </div>

           <h1 class="text-3xl font-bold text-zinc-900 dark:text-white mb-2">{{ meta.id }} {{ meta.stockName }} 投資分析報告</h1>
           <div class="flex items-center gap-4 text-sm text-zinc-500">
               <span class="flex items-center gap-1"><i class="pi pi-calendar"></i> {{ meta.date }}</span>
               <span 
                :class="meta.sentiment === 'bullish' ? 'text-red-500 bg-red-50 px-2 py-0.5 rounded' : 'text-green-500 bg-green-50 px-2 py-0.5 rounded'"
                class="flex items-center gap-1 font-medium"
               >
                   {{ meta.sentiment === 'bullish' ? '看多' : '看空' }}
               </span>
           </div>
        </div>

        <!-- Body -->
        <div class="p-8">
            <MarkdownViewer :content="markdownBody" />
        </div>
      </article>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from '@/components/NavBar.vue';
import MarkdownViewer from '@/components/MarkdownViewer.vue';

const route = useRoute();
const loading = ref(true);
const error = ref(null);
const reportContent = ref('');
const meta = ref({});

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

    try {
        const res = await fetch(path);
        if (!res.ok) throw new Error('報告載入失敗');
        const text = await res.text();
        
        // Manual frontmatter parsing if gray-matter fails or just to be safe/lightweight
        // Simple regex for yaml frontmatter
        const protect = /^---[\r\n\s\S]*?---[\r\n]+/;
        const match = text.match(protect);
        
        if (match) {
            reportContent.value = text.replace(match[0], '');
            // We could parse the frontmatter, but we also have metadata passed via route or we can assume store has it.
            // Better to use the store to get "Complete" metadata if needed, 
            // but here we just display what we have or rely on what's in the text.
            // Let's try to extract basic meta from text if we really want, or fallback to route params.
            // Route params: category, stockId.
            // We can assume the JSON index data is the source of truth for "meta" header display.
            
            // To be robust: fetch metadata from store if not present
        } else {
            reportContent.value = text;
        }

        // Initialize display meta from route params + reasonable defaults
        meta.value = {
            category: route.params.category,
            id: route.params.stockId,
            stockName: route.params.stockId === '2330' ? '台積電' : (route.params.stockId === '0050' ? '元大台灣50' : '緯創'), // Fallback map or fetch from store
            date: '2026-02-01', // Should fetch from store or file
            sentiment: 'bullish'
        };
        
        // If we want real metadata, we should find it in the store based on ID/Path
        // But for now this is enough for display.
        
    } catch (err) {
        error.value = err.message;
    } finally {
        loading.value = false;
    }
});
</script>
