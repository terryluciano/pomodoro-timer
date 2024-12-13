<script setup>
import { twMerge } from 'tailwind-merge'

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
        required: true,
    },
})
</script>

<template>
    <button
        :class="
            twMerge(
                'h-10 px-4 rounded-lg border-2 border-solid transition-all ease-linear duration-100 shadow-button-default active:shadow-button-active active:translate-y-[3px]',
                props.isActive
                    ? 'bg-main-white/50 text-black/70 border-main-white/70'
                    : 'bg-main-white/80 text-black border-main-white',
                props.class
            )
        "
        @click="props.onClick"
    >
        <span class="font-medium text-lg">
            <slot></slot>
        </span>
    </button>
</template>
