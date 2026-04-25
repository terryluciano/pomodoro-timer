export const DEFAULT_FOCUS_TIMER_DURATION = 25;
export const DEFAULT_SHORT_BREAK_TIMER_DURATION = 5;
export const DEFAULT_LONG_BREAK_TIMER_DURATION = 15;

export const MINUTE_IN_MS = 60000;

export const DEFAULT_MASTER_VOLUME = 100;
export const DEFAULT_VOLUME = 50;

export const DEFAULT_LONG_BREAK_INTERVAL = 4;

export const LOCAL_STORAGE_SETTINGS_KEY = 'settings';
export const LOCAL_STORAGE_TODOS_KEY = 'todos';

export interface TimerPreset {
    id: string;
    name: string;
    focusDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
}

export const TIMER_PRESETS: TimerPreset[] = [
    {
        id: 'classic-pomodoro',
        name: 'Classic Pomodoro',
        focusDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
    },
    {
        id: 'short-sprint',
        name: 'Short Sprint',
        focusDuration: 15,
        shortBreakDuration: 3,
        longBreakDuration: 10,
    },
    {
        id: 'deep-work',
        name: 'Deep Work',
        focusDuration: 50,
        shortBreakDuration: 10,
        longBreakDuration: 20,
    },
];

export const DEFAULT_PRESET_ID = 'classic-pomodoro';

export const CHARS = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
];
