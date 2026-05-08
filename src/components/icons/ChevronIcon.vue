<script lang="ts" setup>
defineOptions({ inheritAttrs: false });
</script>

<template>
    <svg
        v-bind="$attrs"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M15 6L9 12L15 18"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
</template>
