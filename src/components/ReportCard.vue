<template>
  <div
    class="group block bg-white dark:bg-zinc-900 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 border border-slate-100 dark:border-zinc-800 p-6 transition-all duration-500 hover:-translate-y-2 animate__animated animate__fadeIn cursor-pointer"
    @click="$emit('click')">
    <div class="flex justify-between items-start mb-4">
      <div class="flex items-center gap-2">
        <span
          class="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full border border-indigo-100 dark:border-indigo-800 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
          {{ report.category }}
        </span>
        <span :class="sentimentClass" class="text-xs font-bold px-3 py-1 rounded-full border">
          {{ sentimentLabel }}
        </span>
      </div>
      <span class="text-xs text-slate-400 font-medium font-mono">{{ report.date }}</span>
    </div>

    <h3
      class="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
      {{ report.stockName }} <span class="text-slate-400 text-sm font-normal">({{ report.id }})</span>
    </h3>

    <p class="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed mb-4">
      {{ report.summary || '點擊查看詳細分析報告...' }}
    </p>

    <div class="flex items-center justify-between mt-4 pt-4 border-t border-slate-50 dark:border-zinc-800">
      <div class="text-xs text-slate-500 flex items-center gap-1">
        <i class="pi pi-tag text-[10px]"></i>
        <span class="font-semibold text-slate-400">進入點:</span>
        <span class="text-slate-700 dark:text-slate-300">{{ report.entry || '分析中' }}</span>
      </div>
      <div
        class="text-indigo-600 dark:text-indigo-400 text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
        閱讀詳情 <i class="pi pi-chevron-right text-[10px]"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  report: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

const sentimentLabel = computed(() => {
  return props.report.sentiment === 'bullish' ? '看多' : '看空'
})

const sentimentClass = computed(() => {
  return props.report.sentiment === 'bullish'
    ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50'
    : 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50'
})
</script>
