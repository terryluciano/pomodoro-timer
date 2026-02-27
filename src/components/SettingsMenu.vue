<script setup>
import { useStore } from '@/store/store';
import { storeToRefs } from 'pinia';
import InputField from './InputField.vue';

const store = useStore();

const {
    focusTimerDuration,
    shortBreakTimerDuration,
    longBreakTimerDuration,
    masterVolume,
    clickVolume,
    alarmVolume,
    autoStartFocus,
    autoStartBreak,
} = storeToRefs(store);

const open = defineModel({ type: Boolean, required: true });

const closeSettings = () => {
    open.value = false;
};
</script>

<template>
    <div
        class="fixed inset-0 z-50 flex items-end xs:items-stretch xs:justify-end bg-black/35 backdrop-blur-sm transition-opacity duration-300"
        :class="
            open
                ? 'pointer-events-auto opacity-100'
                : 'pointer-events-none opacity-0'
        "
        @click.self.prevent="closeSettings"
    >
        <aside
            role="dialog"
            aria-modal="true"
            aria-label="Settings menu"
            class="w-full xs:w-[430px] xs:h-full xs:max-h-none max-h-[92vh] overflow-y-auto rounded-t-3xl xs:rounded-none xs:rounded-l-3xl border border-white/20 bg-white/20 text-main-white backdrop-blur-md shadow-2xl transition-transform duration-300 ease-out"
            :class="
                open
                    ? 'translate-y-0 xs:translate-y-0 xs:translate-x-0'
                    : 'translate-y-full xs:translate-y-0 xs:translate-x-full'
            "
        >
            <div class="space-y-5 px-4 py-5 xs:px-6 xs:py-7">
                <header class="border-b border-white/15 pb-4">
                    <h2 class="text-2xl font-bold tracking-tight">Settings</h2>
                    <p class="text-sm text-white/75">
                        Adjust timers, behavior, and sound levels
                    </p>
                </header>

                <form class="space-y-5">
                    <section
                        class="space-y-4 rounded-2xl border border-white/20 bg-white/10 p-4 xs:p-5"
                    >
                        <h3
                            class="text-base font-semibold uppercase tracking-wide text-white/85"
                        >
                            Timer Durations
                        </h3>

                        <div class="space-y-3">
                            <InputField
                                id="focus-duration"
                                v-model:model-value.number="focusTimerDuration"
                                label="Focus timer (minutes)"
                                for="focus-duration"
                                name="focusDuration"
                                :min="1"
                                :max="180"
                                :step="1"
                                value-type="duration"
                            />

                            <InputField
                                id="short-break-duration"
                                v-model:model-value.number="
                                    shortBreakTimerDuration
                                "
                                label="Short break (minutes)"
                                for="short-break-duration"
                                name="shortBreakDuration"
                                :min="1"
                                :max="60"
                                :step="1"
                                value-type="duration"
                            />

                            <InputField
                                id="long-break-duration"
                                v-model:model-value.number="
                                    longBreakTimerDuration
                                "
                                label="Long break (minutes)"
                                for="long-break-duration"
                                name="longBreakDuration"
                                :min="1"
                                :max="90"
                                :step="1"
                                value-type="duration"
                            />
                        </div>
                    </section>

                    <section
                        class="space-y-4 rounded-2xl border border-white/20 bg-white/10 p-4 xs:p-5"
                    >
                        <h3
                            class="text-base font-semibold uppercase tracking-wide text-white/85"
                        >
                            Volume
                        </h3>

                        <div class="space-y-4">
                            <InputField
                                id="master-volume"
                                v-model:model-value.number="masterVolume"
                                value-type="volume"
                                secondary-id="master-volume-input"
                                name="masterVolume"
                                secondary-name="masterVolumeInput"
                                label="Master Volume"
                                for="master-volume"
                                :min="0"
                                :max="100"
                                :step="1"
                            />

                            <InputField
                                id="click-volume"
                                v-model:model-value.number="clickVolume"
                                value-type="volume"
                                secondary-id="click-volume-input"
                                name="clickVolume"
                                secondary-name="clickVolumeInput"
                                label="Click Volume"
                                for="click-volume"
                                :min="0"
                                :max="100"
                                :step="1"
                            />

                            <InputField
                                id="alarm-volume"
                                v-model:model-value.number="alarmVolume"
                                value-type="volume"
                                secondary-id="alarm-volume-input"
                                name="alarmVolume"
                                secondary-name="alarmVolumeInput"
                                label="Alarm Volume"
                                for="alarm-volume"
                                :min="0"
                                :max="100"
                                :step="1"
                            />
                        </div>
                    </section>

                    <section
                        class="space-y-4 rounded-2xl border border-white/20 bg-white/10 p-4 xs:p-5"
                    >
                        <h3
                            class="text-base font-semibold uppercase tracking-wide text-white/85"
                        >
                            Options
                        </h3>

                        <div class="space-y-3">
                            <label
                                for="auto-start-focus"
                                class="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 cursor-pointer"
                            >
                                <input
                                    id="auto-start-focus"
                                    v-model="autoStartFocus"
                                    name="autoStartFocus"
                                    type="checkbox"
                                    class="size-4 rounded border-white/40 bg-transparent accent-white"
                                />
                                <span class="text-sm xs:text-base text-white/90"
                                    >Auto start focus timer</span
                                >
                            </label>

                            <label
                                for="auto-start-break"
                                class="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-3 py-2.5"
                            >
                                <input
                                    id="auto-start-break"
                                    v-model="autoStartBreak"
                                    name="autoStartBreak"
                                    type="checkbox"
                                    class="size-4 rounded border-white/40 bg-transparent accent-white"
                                />
                                <span class="text-sm xs:text-base text-white/90"
                                    >Auto start break timer</span
                                >
                            </label>

                            <div
                                class="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/10 px-3 py-2.5"
                            >
                                <label
                                    for="disable-long-breaks"
                                    class="text-sm xs:text-base text-white/90"
                                >
                                    Disable long breaks
                                </label>
                                <label
                                    for="disable-long-breaks"
                                    class="relative inline-flex cursor-pointer items-center"
                                >
                                    <input
                                        id="disable-long-breaks"
                                        name="disableLongBreaks"
                                        type="checkbox"
                                        class="peer sr-only"
                                    />
                                    <span
                                        class="h-6 w-11 rounded-full bg-white/25 transition-colors peer-checked:bg-white/50"
                                    ></span>
                                    <span
                                        class="pointer-events-none absolute left-1 top-1 size-4 rounded-full bg-main-white transition-transform peer-checked:translate-x-5"
                                    ></span>
                                </label>
                            </div>

                            <div
                                class="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/10 px-3 py-2.5"
                            >
                                <label
                                    for="long-break-every"
                                    class="text-sm xs:text-base text-white/90"
                                >
                                    Long break every
                                </label>
                                <div class="flex items-center gap-2">
                                    <input
                                        id="long-break-every"
                                        name="longBreakEvery"
                                        type="number"
                                        min="1"
                                        max="12"
                                        step="1"
                                        value="4"
                                        class="h-9 w-16 rounded-lg border border-white/25 bg-white/15 px-2 text-right text-main-white outline-none transition focus:border-white/60 focus:ring-2 focus:ring-white/25"
                                    />
                                    <span class="text-sm text-white/75"
                                        >focus sessions</span
                                    >
                                </div>
                            </div>
                        </div>
                    </section>
                </form>
            </div>
        </aside>
    </div>
</template>
