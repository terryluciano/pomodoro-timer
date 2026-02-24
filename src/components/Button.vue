<script setup>
import { twMerge } from 'tailwind-merge';

const props = defineProps({
    class: {
        type: String,
        default: '',
    },
    isActive: {
        type: Boolean,
    },
    onClick: {
        type: Function,
        required: false,
    },
});
</script>

<template>
    <button
        :class="
            twMerge(
                'h-12 px-6 rounded-full transition-all ease-out duration-200 active:scale-95 text-main-white flex items-center justify-center shadow-sm hover:shadow',
                props.isActive
                    ? 'bg-white/40 ring-2 ring-white/50 shadow-inner'
                    : 'bg-white/20 hover:bg-white/30 border border-white/10',
                props.class
            )
        "
        @click="props?.onClick"
    >
        <span class="font-medium text-lg">
            <slot></slot>
        </span>
    </button>
</template>
