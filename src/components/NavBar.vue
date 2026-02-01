<template>
    <nav class="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/70 dark:bg-black/70 border-b border-zinc-200 dark:border-zinc-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <!-- Logo -->
                <div class="flex-shrink-0 cursor-pointer" @click="$router.push('/')">
                    <div class="flex items-center gap-2">
                        <i class="pi pi-chart-line text-2xl text-indigo-600 dark:text-indigo-400"></i>
                         <h1 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                            investAi
                        </h1>
                    </div>
                </div>
                
                <!-- Actions -->
                <div class="hidden md:block">
                    <div class="ml-10 flex items-baseline space-x-4">
                        <a href="https://github.com/FiReBrO42/investAi" target="_blank" class="text-zinc-600 hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            <i class="pi pi-github text-lg"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
</script>
