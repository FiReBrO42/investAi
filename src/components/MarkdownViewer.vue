<template>
  <div class="markdown-body prose prose-slate dark:prose-invert max-w-none 
    prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
    prose-p:text-slate-600 dark:prose-p:text-slate-300
    prose-a:text-indigo-600 dark:prose-a:text-indigo-400 hover:prose-a:text-indigo-500
    prose-strong:text-slate-900 dark:prose-strong:text-white
    prose-img:rounded-2xl prose-img:shadow-lg" v-html="renderedContent"></div>
</template>

<script setup>
/**
 * Markdown 渲染組件
 * 使用 markdown-it 定義渲染規則，並搭配 Tailwind Typography (prose) 進行排版
 */
import { computed } from 'vue';
import MarkdownIt from 'markdown-it';

const props = defineProps({
  content: {
    type: String, // Markdown 格式的字串內容
    required: true
  }
})

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

const renderedContent = computed(() => {
  if (!props.content) return '';
  return md.render(props.content);
})
</script>

<style>
/* Add any custom markdown styles here if Tailwind Typography isn't enough */
.markdown-body table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.markdown-body th,
.markdown-body td {
  border: 1px solid #e2e8f0;
  padding: 0.5rem;
}

.dark .markdown-body th,
.dark .markdown-body td {
  border-color: #3f3f46;
}
</style>
