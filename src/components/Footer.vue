<script setup>
import githubIcon from '@/assets/github.svg';
</script>

<template>
    <div
        class="w-full xs:h-12 h-10 flex items-center justify-center flex-shrink-0 border-t border-white/10"
    >
        <a
            href="https://github.com/terryluciano/pomodoro-timer"
            target="_blank"
            rel="noopener noreferrer"
            class="group h-full flex items-center justify-center gap-2 flex-shrink-0 text-white/50 hover:text-white/80 transition-all duration-200"
        >
            <img
                :src="githubIcon"
                class="xs:size-5 size-4 group-hover:opacity-80 opacity-50 transition-all duration-200"
            />
            <span class="text-sm font-medium tracking-wide">Terry Luciano</span>
        </a>
    </div>
</template>
