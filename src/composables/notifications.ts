import {
    FOCUS_COMPLETE_MESSAGES,
    BREAK_COMPLETE_MESSAGES,
} from '@/lib/notifications';

function pickRandom<T>(arr: readonly T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function useNotifications() {
    const requestPermission = async (): Promise<NotificationPermission> => {
        if (!('Notification' in window)) {
            return 'denied';
        }
        if (Notification.permission === 'granted') {
            return 'granted';
        }
        if (Notification.permission === 'denied') {
            return 'denied';
        }
        return Notification.requestPermission();
    };

    const notifyTimerComplete = (isFocusComplete: boolean): void => {
        if (!('Notification' in window) || Notification.permission !== 'granted') {
            return;
        }

        const title = isFocusComplete
            ? 'Focus Session Complete'
            : 'Break Session Complete';

        const body = isFocusComplete
            ? pickRandom(FOCUS_COMPLETE_MESSAGES)
            : pickRandom(BREAK_COMPLETE_MESSAGES);

        new Notification(title, {
            body,
            icon: '/tomato.svg',
            badge: '/tomato.svg',
        });
    };

    return {
        requestPermission,
        notifyTimerComplete,
    };
}
