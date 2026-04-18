<script lang="ts" setup>
defineOptions({ inheritAttrs: false });
</script>

<template>
    <svg
        v-bind="$attrs"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <path d="M3 5l3-3 3 3" />
        <path d="M3 7l3 3 3-3" />
    </svg>
</template>
