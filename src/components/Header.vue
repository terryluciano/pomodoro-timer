<script setup>
import settingsIcon from '@/assets/settings.svg';
import Button from './Button.vue';

const props = defineProps({
    toggleSettingsOpen: {
        type: Function,
        required: true,
    },
    openToDo: {
        type: Function,
        required: true,
    },
});
</script>

<template>
    <div
        class="w-full xs:h-16 h-12 flex items-center justify-end flex-shrink-0 border-b border-white/10 px-4"
    >
        <Button
            class="xs:size-10 size-8 xs:px-1 xs:py-1 px-1 py-1 flex-shrink-0"
            :on-click="props.toggleSettingsOpen"
        >
            <img class="size-full" :src="settingsIcon" alt="settings" />
        </Button>
    </div>
</template>
