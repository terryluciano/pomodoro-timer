<script lang="ts" setup>
defineOptions({ inheritAttrs: false });
</script>

<template>
    <svg
        v-bind="$attrs"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <path d="M2 2l8 8M10 2l-8 8" />
    </svg>
</template>
