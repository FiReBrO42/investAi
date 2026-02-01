<template>

  <div class="mb-4">
    <div class="flex items-center gap-2 mb-2">
      <span class="text-xs font-medium px-2 py-1 rounded bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
        {{ report.category }}
      </span>
      <span :class="sentimentClass" class="text-xs font-medium px-2 py-1 rounded">
        {{ sentimentLabel }}
      </span>
    </div>
    <p class="text-zinc-600 dark:text-zinc-300 text-sm line-clamp-3 leading-relaxed">
      {{ report.summary || '點擊查看詳細分析報告...' }}
    </p>
  </div>

  <div class="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-700">
    <div class="text-xs text-zinc-500">
      <span class="font-semibold">策略:</span> {{ report.entry || 'N/A' }}
    </div>
    <button class="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline flex items-center gap-1">
      閱讀更多 <i class="pi pi-arrow-right text-xs"></i>
    </button>
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
    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' // 台股紅是漲
    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
})
</script>
