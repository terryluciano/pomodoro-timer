<script setup>
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
                            <div
                                class="flex items-center justify-between gap-3"
                            >
                                <label
                                    for="focus-duration"
                                    class="text-sm xs:text-base text-white/90"
                                >
                                    Focus timer (minutes)
                                </label>
                                <input
                                    id="focus-duration"
                                    name="focusDuration"
                                    type="number"
                                    min="1"
                                    max="180"
                                    step="1"
                                    value="25"
                                    class="h-10 w-24 rounded-xl border border-white/25 bg-white/15 px-3 text-right text-main-white outline-none transition focus:border-white/60 focus:ring-2 focus:ring-white/25"
                                />
                            </div>

                            <div
                                class="flex items-center justify-between gap-3"
                            >
                                <label
                                    for="short-break-duration"
                                    class="text-sm xs:text-base text-white/90"
                                >
                                    Short break (minutes)
                                </label>
                                <input
                                    id="short-break-duration"
                                    name="shortBreakDuration"
                                    type="number"
                                    min="1"
                                    max="60"
                                    step="1"
                                    value="5"
                                    class="h-10 w-24 rounded-xl border border-white/25 bg-white/15 px-3 text-right text-main-white outline-none transition focus:border-white/60 focus:ring-2 focus:ring-white/25"
                                />
                            </div>

                            <div
                                class="flex items-center justify-between gap-3"
                            >
                                <label
                                    for="long-break-duration"
                                    class="text-sm xs:text-base text-white/90"
                                >
                                    Long break (minutes)
                                </label>
                                <input
                                    id="long-break-duration"
                                    name="longBreakDuration"
                                    type="number"
                                    min="1"
                                    max="90"
                                    step="1"
                                    value="15"
                                    class="h-10 w-24 rounded-xl border border-white/25 bg-white/15 px-3 text-right text-main-white outline-none transition focus:border-white/60 focus:ring-2 focus:ring-white/25"
                                />
                            </div>
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
                                class="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-3 py-2.5"
                            >
                                <input
                                    id="auto-start-focus"
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

                    <section
                        class="space-y-4 rounded-2xl border border-white/20 bg-white/10 p-4 xs:p-5"
                    >
                        <h3
                            class="text-base font-semibold uppercase tracking-wide text-white/85"
                        >
                            Volume
                        </h3>

                        <div class="space-y-4">
                            <div class="space-y-2">
                                <div
                                    class="flex items-center justify-between gap-3"
                                >
                                    <label
                                        for="master-volume"
                                        class="text-sm xs:text-base text-white/90"
                                    >
                                        Master volume
                                    </label>
                                    <div class="flex items-center gap-1.5">
                                        <input
                                            id="master-volume-input"
                                            name="masterVolumeInput"
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="1"
                                            value="100"
                                            class="h-9 w-16 rounded-lg border border-white/25 bg-white/15 px-2 text-right text-main-white outline-none transition focus:border-white/60 focus:ring-2 focus:ring-white/25"
                                        />
                                        <span class="text-sm text-white/75"
                                            >%</span
                                        >
                                    </div>
                                </div>
                                <input
                                    id="master-volume"
                                    name="masterVolume"
                                    type="range"
                                    min="0"
                                    max="100"
                                    value="100"
                                    class="h-2 w-full cursor-pointer rounded-full bg-white/30 accent-white"
                                />
                            </div>

                            <div class="space-y-2">
                                <div
                                    class="flex items-center justify-between gap-3"
                                >
                                    <label
                                        for="click-volume"
                                        class="text-sm xs:text-base text-white/90"
                                    >
                                        Click volume
                                    </label>
                                    <div class="flex items-center gap-1.5">
                                        <input
                                            id="click-volume-input"
                                            name="clickVolumeInput"
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="1"
                                            value="50"
                                            class="h-9 w-16 rounded-lg border border-white/25 bg-white/15 px-2 text-right text-main-white outline-none transition focus:border-white/60 focus:ring-2 focus:ring-white/25"
                                        />
                                        <span class="text-sm text-white/75"
                                            >%</span
                                        >
                                    </div>
                                </div>
                                <input
                                    id="click-volume"
                                    name="clickVolume"
                                    type="range"
                                    min="0"
                                    max="100"
                                    value="50"
                                    class="h-2 w-full cursor-pointer rounded-full bg-white/30 accent-white"
                                />
                            </div>

                            <div class="space-y-2">
                                <div
                                    class="flex items-center justify-between gap-3"
                                >
                                    <label
                                        for="alert-volume"
                                        class="text-sm xs:text-base text-white/90"
                                    >
                                        Alert / alarm volume
                                    </label>
                                    <div class="flex items-center gap-1.5">
                                        <input
                                            id="alert-volume-input"
                                            name="alertVolumeInput"
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="1"
                                            value="50"
                                            class="h-9 w-16 rounded-lg border border-white/25 bg-white/15 px-2 text-right text-main-white outline-none transition focus:border-white/60 focus:ring-2 focus:ring-white/25"
                                        />
                                        <span class="text-sm text-white/75"
                                            >%</span
                                        >
                                    </div>
                                </div>
                                <input
                                    id="alert-volume"
                                    name="alertVolume"
                                    type="range"
                                    min="0"
                                    max="100"
                                    value="50"
                                    class="h-2 w-full cursor-pointer rounded-full bg-white/30 accent-white"
                                />
                            </div>
                        </div>
                    </section>
                </form>
            </div>
        </aside>
    </div>
</template>
