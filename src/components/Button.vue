<script setup>
import { twMerge } from 'tailwind-merge';

const props = defineProps({
    class: {
        type: String,
        default: '',
    },
    contentClass: {
        type: String,
        default: '',
    },
    isActive: {
        type: Boolean,
    },
    onClick: {
        type: Function,
        required: false,
        default: () => {},
    },
    size: {
        type: String,
        default: 'large',
    },
});
</script>

<template>
    <button
        :class="
            twMerge(
                'rounded-full transition-all ease-out duration-200 active:scale-95 text-main-white flex flex-row items-center justify-center shadow-sm hover:shadow',
                props.size === 'small'
                    ? 'xs:h-10 h-8 xs:px-4 px-3'
                    : 'xs:h-12 h-10 xs:px-6 px-4',
                props.isActive
                    ? 'bg-white/40 ring-2 ring-white/50 shadow-inner'
                    : 'bg-white/20 hover:bg-white/30 border border-white/10',
                props.class
            )
        "
        @click="() => props?.onClick()"
    >
        <div
            :class="
                twMerge(
                    'font-medium',
                    props.size === 'small' ? 'xs:text-lg text-base' : 'text-lg',
                    props.contentClass
                )
            "
        >
            <slot></slot>
        </div>
    </button>
</template>
