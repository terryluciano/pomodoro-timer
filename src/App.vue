<script setup>
import { Howl } from 'howler';
import { twMerge } from 'tailwind-merge';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import chimeSound from '@/assets/chime.mp3';
import clickSound from '@/assets/click.mp3';
import settingsIcon from '@/assets/settings.svg';
import Button from '@/components/Button.vue';
import SettingsMenu from './components/SettingsMenu.vue';

const WORK_TIME = 1000 * 60 * 25;
const SHORT_BREAK_TIME = 1000 * 60 * 5;
const LONG_BREAK_TIME = 1000 * 60 * 15;

const remainingTime = ref(WORK_TIME);

const timerState = ref(false);
const focusState = ref(true);

const workCount = ref(1);
const breakCount = ref(0);

const settingsOpen = ref(false);

/**
 * @type {Howl | null}
 */
let click;
/**
 * @type {Howl | null}
 */
let chime;

/**
 * @type {number | null}
 */
let intervalId;
/**
 * @type {number | null}
 */
let endTime;

const initializeAudio = () => {
    if (!click) {
        click = new Howl({
            src: [clickSound],
            volume: 0.5,
            loop: false,
        });
    }
    if (!chime) {
        chime = new Howl({
            src: [chimeSound],
            volume: 0.5,
            loop: false,
        });
    }
};

// I think there is something wrong with howler because the play method params should be optional according to the docs: https://github.com/goldfire/howler.js?tab=readme-ov-file#playspriteid
const playClick = () => {
    // @ts-ignore
    click?.play();
};

const playChime = () => {
    // @ts-ignore
    chime?.play();
};

const getDefaultTime = () => {
    if (focusState.value) {
        return WORK_TIME;
    }
    return breakCount.value > 0 && breakCount.value % 4 === 0
        ? LONG_BREAK_TIME
        : SHORT_BREAK_TIME;
};

const updateTimer = () => {
    if (!endTime || !timerState.value) return;

    const now = Date.now();
    remainingTime.value = Math.max(0, endTime - now);

    if (remainingTime.value <= 0) {
        handleTimerComplete();
    }
};

const handleTimerComplete = () => {
    playChime();
    stopTimer();

    if (focusState.value) {
        focusState.value = false;
        breakCount.value++;
    } else {
        focusState.value = true;
        workCount.value++;
    }

    remainingTime.value = getDefaultTime();
};

const startTimer = () => {
    playClick();

    if (remainingTime.value <= 0) {
        remainingTime.value = getDefaultTime();
    }

    endTime = Date.now() + remainingTime.value;
    timerState.value = true;

    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(updateTimer, 100);
    updateTimer();
};

const pauseTimer = () => {
    playClick();
    stopTimer();
};

const stopTimer = () => {
    timerState.value = false;
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    endTime = null;
};

const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible' && timerState.value) {
        updateTimer();
    }
};

watch(focusState, (state) => {
    localStorage.setItem('focusState', String(state));
});

watch(workCount, (state) => {
    localStorage.setItem('workCount', String(state));
});

watch(breakCount, (state) => {
    localStorage.setItem('breakCount', String(state));
});

watch(remainingTime, (state) => {
    localStorage.setItem('remainingTime', String(state));
});

onMounted(() => {
    initializeAudio();

    const storedFocusState = localStorage.getItem('focusState');
    if (storedFocusState) {
        focusState.value = storedFocusState === 'true';
    }

    const storedWorkCount = localStorage.getItem('workCount');
    if (storedWorkCount) {
        workCount.value = Number(storedWorkCount);
    }

    const storedBreakCount = localStorage.getItem('breakCount');
    if (storedBreakCount) {
        breakCount.value = Number(storedBreakCount);
    }

    const storedRemainingTime = localStorage.getItem('remainingTime');
    if (storedRemainingTime) {
        remainingTime.value = Number(storedRemainingTime);
    } else {
        remainingTime.value = getDefaultTime();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
});

onUnmounted(() => {
    if (intervalId) clearInterval(intervalId);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
});

const handleFocusButtonClick = () => {
    if (!focusState.value) {
        playClick();
        stopTimer();
        workCount.value++;
        focusState.value = true;
        remainingTime.value = WORK_TIME;
    }
};

const handleBreakButtonClick = () => {
    if (focusState.value) {
        playClick();
        stopTimer();
        breakCount.value++;
        focusState.value = false;
        remainingTime.value = SHORT_BREAK_TIME;
    }
};

const hardReset = () => {
    playClick();
    localStorage.clear();
    stopTimer();
    focusState.value = true;
    workCount.value = 1;
    breakCount.value = 0;
    remainingTime.value = WORK_TIME;
};

const currentTime = computed(() => {
    const minutes = Math.floor(remainingTime.value / 1000 / 60);
    const seconds = Math.floor(remainingTime.value / 1000) % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    document.title = `${formattedTime} - ${focusState.value ? 'Focus' : 'Break'} Mode`;

    return formattedTime;
});

const countText = computed(() => {
    return `${focusState.value ? 'Focus' : 'Break'} Count: ${focusState.value ? workCount.value : breakCount.value}`;
});

const toggleSettingsOpen = () => {
    settingsOpen.value = !settingsOpen.value;
};
</script>

<template>
    <div
        :class="
            twMerge(
                'relative size-full flex flex-col justify-center items-center xs:py-10 py-16 xs:px-0 px-4 text-main-white font-Nunito transition-all duration-[0.75s] ease-in-out',
                focusState ? 'bg-main-focus' : 'bg-main-break'
            )
        "
    >
        <div
            class="relative flex flex-col xs:justify-center items-center max-w-96 xs:gap-4 gap-3 h-full"
        >
            <p class="text-white/80 font-semibold text-lg">
                {{ countText }}
            </p>

            <div class="flex flex-row xs:gap-4 gap-3 items-center w-full">
                <Button
                    class="w-full text-nowrap"
                    :is-active="focusState"
                    :on-click="handleFocusButtonClick"
                >
                    Focus Mode
                </Button>
                <Button
                    class="w-full text-nowrap"
                    :is-active="!focusState"
                    :on-click="handleBreakButtonClick"
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
                class="bg-white/20 backdrop-blur-md shadow-lg rounded-3xl border border-white/20 h-auto p-10 flex flex-col gap-2 items-center w-full"
            >
                <h1 class="font-bold text-4xl">
                    {{ focusState ? 'Focus Mode' : 'Take a Break' }}
                </h1>
                <p class="text-8xl font-medium tabular-nums tracking-tight">
                    {{ currentTime }}
                </p>
            </div>

            <div class="flex flex-row items-center w-full">
                <Button
                    :is-active="false"
                    :on-click="timerState ? pauseTimer : startTimer"
                    class="w-full"
                    >{{ timerState ? 'Pause' : 'Start' }}</Button
                >
            </div>
        </div>
        <Button class="flex-shrink-0" :is-active="false" :on-click="hardReset"
            >Hard Reset</Button
        >
    </div>
    <SettingsMenu v-model="settingsOpen" />
</template>
