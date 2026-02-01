<template>
    <nav
        class="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/70 dark:bg-black/70 border-b border-zinc-200 dark:border-zinc-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <!-- Logo -->
                <div class="flex-shrink-0 cursor-pointer group" @click="$router.push('/')">
                    <div
                        class="flex items-center gap-2 transition-transform duration-300 group-hover:scale-105 active:scale-95">
                        <i
                            class="pi pi-chart-line text-2xl text-indigo-600 dark:text-indigo-400 group-hover:rotate-12 transition-transform"></i>
                        <h1
                            class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 group-hover:opacity-80 transition-opacity">
                            investAi
                        </h1>
                    </div>
                </div>

            </div>
        </div>
    </nav>
</template>

<script setup>
/**
 * 全局導覽列組件
 * 包含品牌 Logo、鏈結以及響應式佈局
 */
</script>
