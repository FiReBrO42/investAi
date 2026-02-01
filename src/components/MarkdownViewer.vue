<template>
  <div class="markdown-body prose prose-slate dark:prose-invert max-w-none hover:prose-a:text-indigo-500 prose-img:rounded-xl" v-html="renderedContent"></div>
</template>

<script setup>
import { computed } from 'vue';
import MarkdownIt from 'markdown-it';

const props = defineProps({
  content: {
    type: String,
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
.markdown-body th, .markdown-body td {
    border: 1px solid #e2e8f0;
    padding: 0.5rem;
}
.dark .markdown-body th, .dark .markdown-body td {
    border-color: #3f3f46;
}
</style>
