import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
    DEFAULT_FOCUS_TIMER_DURATION,
    DEFAULT_SHORT_BREAK_TIMER_DURATION,
    DEFAULT_LONG_BREAK_TIMER_DURATION,
    DEFAULT_MASTER_VOLUME,
    DEFAULT_VOLUME,
    DEFAULT_LONG_BREAK_INTERVAL,
    MINUTE_IN_MS,
} from '@/lib/constants';

export const useStore = defineStore('store', () => {
    const initialized = ref(false);

    const focusTimerDuration = ref(DEFAULT_FOCUS_TIMER_DURATION);
    const shortBreakTimerDuration = ref(DEFAULT_SHORT_BREAK_TIMER_DURATION);
    const longBreakTimerDuration = ref(DEFAULT_LONG_BREAK_TIMER_DURATION);

    const remainingTime = ref(DEFAULT_FOCUS_TIMER_DURATION);

    const timerState = ref(false);
    const focusState = ref(true);

    const focusCount = ref(1);
    const breakCount = ref(0);

    const masterVolume = ref(DEFAULT_MASTER_VOLUME);
    const clickVolume = ref(DEFAULT_VOLUME);
    const alarmVolume = ref(DEFAULT_VOLUME);

    const longBreakInterval = ref(DEFAULT_LONG_BREAK_INTERVAL); // after X amount of work sessions, take a long break

    const autoStartFocus = ref(false);
    const autoStartBreak = ref(false);
    const enableLongBreaks = ref(true);

    const getNewTimerDuration = () => {
        if (focusState.value) {
            return focusTimerDuration.value * MINUTE_IN_MS;
        }
        return focusCount.value % longBreakInterval.value === 0
            ? longBreakTimerDuration.value * MINUTE_IN_MS
            : shortBreakTimerDuration.value * MINUTE_IN_MS;
    };

    /**
     * @param {number} time
     */
    const updateRemainingTime = (time) => {
        remainingTime.value = time;
    };

    const onTimerComplete = () => {
        if (focusState.value) {
            focusState.value = false;
            breakCount.value++;
        } else {
            focusState.value = true;
            focusCount.value++;
        }

        remainingTime.value = getNewTimerDuration();
    };

    const onTimerStart = () => {
        if (remainingTime.value <= 0) {
            remainingTime.value = getNewTimerDuration();
        }

        timerState.value = true;
    };

    const onTimerStop = () => {
        timerState.value = false;
    };

    const onFocusMode = () => {
        if (!focusState.value) {
            focusCount.value++;
            focusState.value = true;
            remainingTime.value = getNewTimerDuration();
        }
    };

    const onBreakMode = () => {
        if (focusState.value) {
            breakCount.value++;
            focusState.value = false;
            remainingTime.value = getNewTimerDuration();
        }
    };

    const init = () => {
        if (initialized.value) return;

        const storedSettings = localStorage.getItem('settings');
        if (storedSettings) {
            const settings = JSON.parse(storedSettings);

            focusState.value = settings.focusState ?? true;

            focusTimerDuration.value =
                settings.focusTimerDuration ?? DEFAULT_FOCUS_TIMER_DURATION;
            shortBreakTimerDuration.value =
                settings.shortBreakTimerDuration ??
                DEFAULT_SHORT_BREAK_TIMER_DURATION;
            longBreakTimerDuration.value =
                settings.longBreakTimerDuration ??
                DEFAULT_LONG_BREAK_TIMER_DURATION;
            masterVolume.value = settings.masterVolume ?? DEFAULT_MASTER_VOLUME;
            clickVolume.value = settings.clickVolume ?? DEFAULT_VOLUME;
            alarmVolume.value = settings.alarmVolume ?? DEFAULT_VOLUME;

            focusCount.value = settings.focusCount ?? 1;
            breakCount.value = settings.breakCount ?? 0;

            autoStartFocus.value = settings.autoStartFocus ?? false;
            autoStartBreak.value = settings.autoStartBreak ?? false;
            enableLongBreaks.value = settings.enableLongBreaks ?? true;

            longBreakInterval.value =
                settings.longBreakInterval ?? DEFAULT_LONG_BREAK_INTERVAL;

            remainingTime.value = settings.remainingTime;
        } else {
            remainingTime.value = getNewTimerDuration();
        }

        initialized.value = true;
    };

    const resetTimer = () => {
        focusState.value = true;
        focusCount.value = 1;
        breakCount.value = 0;
        remainingTime.value = getNewTimerDuration();
    };

    const resetSettings = () => {};

    const $reset = () => {
        focusTimerDuration.value = DEFAULT_FOCUS_TIMER_DURATION;
        shortBreakTimerDuration.value = DEFAULT_SHORT_BREAK_TIMER_DURATION;
        longBreakTimerDuration.value = DEFAULT_LONG_BREAK_TIMER_DURATION;

        remainingTime.value = DEFAULT_FOCUS_TIMER_DURATION;

        timerState.value = false;
        focusState.value = true;

        focusCount.value = 1;
        breakCount.value = 0;

        masterVolume.value = DEFAULT_MASTER_VOLUME;
        clickVolume.value = DEFAULT_VOLUME;
        alarmVolume.value = DEFAULT_VOLUME;

        longBreakInterval.value = DEFAULT_LONG_BREAK_INTERVAL;
    };

    return {
        // states
        initialized,

        focusTimerDuration,
        shortBreakTimerDuration,
        longBreakTimerDuration,

        remainingTime,
        timerState,
        focusState,
        focusCount,
        breakCount,

        masterVolume,
        clickVolume,
        alarmVolume,

        autoStartFocus,
        autoStartBreak,
        enableLongBreaks,

        longBreakInterval,

        // getters
        getNewTimerDuration,

        // actions
        init,
        resetTimer,
        resetSettings,
        updateRemainingTime,
        onTimerComplete,
        onTimerStart,
        onTimerStop,
        onFocusMode,
        onBreakMode,

        // other
        $reset,
    };
});
