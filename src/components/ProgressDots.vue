<script lang="ts" setup>
import { computed } from 'vue';
import { useStore } from '@/store/store';

const store = useStore();

const interval = computed(() => store.longBreakInterval);

const completedCycles = computed(() =>
    Math.floor((store.focusCount - 1) / interval.value)
);
const completedFocuses = computed(
    () => store.breakCount - completedCycles.value * interval.value
);
const completedBreaks = computed(
    () => store.focusCount - 1 - completedCycles.value * interval.value
);
const cycleLabel = computed(
    () =>
        `${completedCycles.value} Cycle${completedCycles.value === 1 ? '' : 's'}`
);

const focusDots = computed(() => {
    const filled = completedFocuses.value;
    return Array.from({ length: interval.value }, (_, i) => i < filled);
});

const breakDots = computed(() => {
    const filled = completedBreaks.value;
    return Array.from({ length: interval.value }, (_, i) => i < filled);
});
</script>

<template>
    <div class="flex w-full items-center justify-between px-2">
        <div class="flex items-center gap-2">
            <span
                class="text-[10px] font-medium uppercase tracking-wider text-white/40"
            >
                Focus
            </span>
            <div class="flex gap-1">
                <div
                    v-for="(filled, index) in focusDots"
                    :key="'f' + index"
                    class="h-1.5 w-1.5 rounded-full transition-all duration-300"
                    :class="
                        filled
                            ? 'bg-white/70 ring-1 ring-white/20'
                            : 'bg-white/10 ring-1 ring-white/20'
                    "
                />
            </div>
        </div>

        <span class="text-xxs font-semibold tabular-nums text-white/50">
            {{ cycleLabel }}
        </span>

        <div class="flex items-center gap-2">
            <div class="flex gap-1">
                <div
                    v-for="(filled, index) in [...breakDots].reverse()"
                    :key="'b' + index"
                    class="h-1.5 w-1.5 rounded-full transition-all duration-300"
                    :class="
                        filled
                            ? 'bg-white/70 ring-1 ring-white/20'
                            : 'bg-white/10 ring-1 ring-white/20'
                    "
                />
            </div>
            <span
                class="text-[10px] font-medium uppercase tracking-wider text-white/40"
            >
                Break
            </span>
        </div>
    </div>
</template>
