<script setup>
import { useStore } from '@/store/store';
import { watch } from 'vue';

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
    for: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    min: {
        type: Number,
        default: 1,
    },
    max: {
        type: Number,
        default: 180,
    },
    step: {
        type: Number,
        default: 1,
    },
    valueType: {
        type: String,
        required: true,
        validator: (/** @type {string} */ value) =>
            ['duration', 'percentage'].includes(value),
    },
});

const store = useStore();

const value = defineModel({
    type: Number,
    required: true,
});

watch(value, () => {
    if (!store.timerState && props.valueType === 'duration') {
        store.updateRemainingTime(store.getNewTimerDuration());
    }
});
</script>

<template>
    <div class="flex items-center justify-between gap-3">
        <label :for="props.for" class="text-sm xs:text-base text-white/90">
            {{ props.label }}
        </label>
        <input
            :id="props.id"
            v-model="value"
            :name="props.name"
            type="number"
            :min="props.min"
            :max="props.max"
            :step="props.step"
            class="h-10 w-24 rounded-xl border border-white/25 bg-white/15 px-3 text-right text-main-white outline-none transition focus:border-white/60 focus:ring-2 focus:ring-white/25"
        />
    </div>
</template>
