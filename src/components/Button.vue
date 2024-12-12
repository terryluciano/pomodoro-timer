<script setup>
const props = defineProps({
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
            'h-10 px-4 rounded-lg border-2 border-solid ' +
            (props.isActive
                ? 'bg-main-white/50 text-black/70 border-main-white/70'
                : 'bg-main-white/80 text-black border-main-white')
        "
        @click="props.onClick"
    >
        <span class="font-medium text-lg">
            <slot></slot>
        </span>
    </button>
</template>
