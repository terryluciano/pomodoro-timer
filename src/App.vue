<script setup>
import { twMerge } from 'tailwind-merge';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import settingsIcon from './assets/settings.svg';
import Button from './components/Button.vue';
import SettingsMenu from './components/SettingsMenu.vue';
import { useStore } from './store/store';
import { useSound } from './composables/sounds';
import Footer from './components/Footer.vue';

const store = useStore();

const { playClick, playChime } = useSound();

const settingsOpen = ref(false);

/**
 * @type {number | null}
 */
let intervalId;
/**
 * @type {number | null}
 */
let endTime;

const updateTimer = () => {
    if (!endTime || !store.timerState) return;

    const newRemainingTime = Math.max(0, endTime - Date.now());

    store.updateRemainingTime(newRemainingTime);

    if (store.remainingTime <= 0) {
        handleTimerComplete();
    }
};

const handleTimerComplete = () => {
    playChime();
    stopTimer();

    store.onTimerComplete();

    if (
        (store.focusState && store.autoStartFocus) ||
        (!store.focusState && store.autoStartBreak)
    ) {
        startTimer();
    }
};

const startTimer = () => {
    store.onTimerStart();

    endTime = Date.now() + store.remainingTime;

    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(updateTimer, 100);
    updateTimer();
};

const handleStartPauseTimer = () => {
    playClick();

    if (store.timerState) {
        stopTimer();
    } else {
        startTimer();
    }
};

const stopTimer = () => {
    store.onTimerStop();
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    endTime = null;
};

const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible' && store.timerState) {
        updateTimer();
    }
};

const onFocusMode = () => {
    if (!store.focusState) {
        playClick();
        stopTimer();
        store.onFocusMode();
    }
};

const onBreakMode = () => {
    if (store.focusState) {
        playClick();
        stopTimer();
        store.onBreakMode();
    }
};

const resetTimer = () => {
    playClick();
    stopTimer();
    store.resetTimer();
};

const toggleSettingsOpen = () => {
    settingsOpen.value = !settingsOpen.value;
};

store.$subscribe((_, state) => {
    if (store.initialized) {
        localStorage.setItem('settings', JSON.stringify(state));
    }
});

const currentTime = computed(() => {
    const totalSeconds = Math.floor(store.remainingTime / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedTime = [hours, minutes, seconds]
        .slice(hours > 0 ? 0 : 1)
        .map((n) => String(n).padStart(2, '0'))
        .join(':');

    document.title = `${formattedTime} - ${store.focusState ? 'Focus' : 'Break'} Mode | PomoDoMore`;

    return formattedTime;
});

const countText = computed(() => {
    return `${store.focusState ? 'Focus' : 'Break'} Count: ${store.focusState ? store.focusCount : store.breakCount}`;
});

onMounted(() => {
    store.init();

    document.addEventListener('visibilitychange', handleVisibilityChange);
});

onUnmounted(() => {
    if (intervalId) clearInterval(intervalId);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
});
</script>

<template>
    <div
        :class="
            twMerge(
                'relative size-full flex flex-col justify-center items-center  px-0 text-main-white font-Nunito transition-all duration-[0.75s] ease-in-out xs:gap-4 gap-3 pt-10 xs:pt-16',
                store.focusState ? 'bg-main-focus' : 'bg-main-break'
            )
        "
    >
        <div
            class="relative flex flex-col xs:justify-center items-center max-w-96 xs:gap-4 gap-3 h-full xs:mx-0 mx-4"
        >
            <p class="text-white/80 font-semibold text-lg">
                {{ countText }}
            </p>

            <div class="flex flex-row xs:gap-4 gap-3 items-center w-full">
                <Button
                    class="w-full text-nowrap"
                    :is-active="store.focusState"
                    :on-click="onFocusMode"
                >
                    Focus Mode
                </Button>
                <Button
                    class="w-full text-nowrap"
                    :is-active="!store.focusState"
                    :on-click="onBreakMode"
                >
                    Take A Break
                </Button>

                <Button
                    class="xs:size-12 size-10 xs:px-1 xs:py-1 px-1 py-1 flex-shrink-0"
                    :on-click="toggleSettingsOpen"
                >
                    <img class="size-full" :src="settingsIcon" alt="settings" />
                </Button>
            </div>

            <div
                class="bg-white/20 backdrop-blur-md shadow-lg rounded-3xl border border-white/20 h-56 p-10 flex flex-col gap-2 items-center justify-center w-full"
            >
                <h1 class="font-bold text-4xl">
                    {{ store.focusState ? 'Focus Mode' : 'Take a Break' }}
                </h1>
                <p
                    :class="
                        twMerge(
                            'text-8xl font-medium tabular-nums tracking-tight',
                            currentTime.length > 5 ? 'text-7xl' : 'text-8xl'
                        )
                    "
                >
                    {{ currentTime }}
                </p>
            </div>

            <div class="flex flex-row items-center w-full">
                <Button
                    :is-active="false"
                    :on-click="handleStartPauseTimer"
                    class="w-full"
                    >{{ store.timerState ? 'Pause' : 'Start' }}</Button
                >
            </div>
        </div>
        <Button class="flex-shrink-0" :is-active="false" :on-click="resetTimer"
            >Reset Timer</Button
        >
        <Footer />
    </div>

    <SettingsMenu v-model="settingsOpen" />
</template>
