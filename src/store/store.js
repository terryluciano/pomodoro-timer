import { defineStore } from 'pinia';

const DEFAULT_WORK_TIME = 1000 * 60 * 25;
const DEFAULT_SHORT_BREAK_TIME = 1000 * 60 * 5;
const DEFAULT_LONG_BREAK_TIME = 1000 * 60 * 15;

export const useTimerStore = defineStore('timer', () => {
    const WORK_TIME = ref(DEFAULT_WORK_TIME);
    const SHORT_BREAK_TIME = ref(DEFAULT_SHORT_BREAK_TIME);
    const LONG_BREAK_TIME = ref(DEFAULT_LONG_BREAK_TIME);

    const remainingTime = ref(WORK_TIME);

    const timerState = ref(false);
    const focusState = ref(true);

    const workCount = ref(1);
    const breakCount = ref(0);

    return {
        WORK_TIME,
        SHORT_BREAK_TIME,
        LONG_BREAK_TIME,

        remainingTime,
        timerState,
        focusState,
        workCount,
        breakCount,
    };
});
