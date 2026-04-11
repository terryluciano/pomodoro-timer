<script setup>
import { useStore } from '@/store/store';
import { watch } from 'vue';

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    secondaryId: {
        type: String,
        default: '',
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
    secondaryName: {
        type: String,
        default: '',
    },
    min: {
        type: Number,
        required: true,
    },
    max: {
        type: Number,
        required: true,
    },
    step: {
        type: Number,
        default: 1,
    },
    valueType: {
        type: String,
        required: true,
        validator: (/** @type {string} */ value) =>
            ['duration', 'volume'].includes(value),
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
    <div
        v-if="props.valueType === 'duration'"
        class="flex items-center justify-between gap-3"
    >
        <label :for="props.for" class="text-sm xs:text-base text-white/90">
            {{ props.label }}
        </label>
        <input
            :id="props.id"
            v-model.number="value"
            :name="props.name"
            type="number"
            :min="props.min"
            :max="props.max"
            :step="props.step"
            class="h-10 w-24 rounded-xl border border-white/25 bg-white/15 px-3 text-right text-main-white outline-none transition focus:border-white/60 focus:ring-2 focus:ring-white/25"
        />
    </div>

    <div v-else class="space-y-2">
        <div class="flex items-center justify-between gap-3">
            <label :for="props.for" class="text-sm xs:text-base text-white/90">
                {{ props.label }}
            </label>
            <div class="flex items-center gap-1.5">
                <input
                    :id="props.secondaryId"
                    v-model.number="value"
                    :name="props.secondaryName"
                    type="number"
                    :min="props.min"
                    :max="props.max"
                    :step="props.step"
                    class="h-9 w-16 rounded-lg border border-white/25 bg-white/15 px-2 text-right text-main-white outline-none transition focus:border-white/60 focus:ring-2 focus:ring-white/25"
                />
                <span class="text-sm text-white/75">%</span>
            </div>
        </div>
        <input
            :id="props.id"
            v-model.number="value"
            :name="props.name"
            type="range"
            :min="props.min"
            :max="props.max"
            class="h-2 w-full cursor-pointer rounded-full bg-white/30 accent-white"
        />
    </div>
</template>
