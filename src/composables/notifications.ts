import {
    FOCUS_COMPLETE_MESSAGES,
    BREAK_COMPLETE_MESSAGES,
} from '@/lib/notifications';
import { useStore } from '@/store/store';

function pickRandom<T>(arr: readonly T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function useNotifications() {
    const store = useStore();

    const requestPermission = async (): Promise<NotificationPermission> => {
        if (store.askedForNotificationPermission) {
            return Notification.permission;
        } else {
            if (!('Notification' in window)) {
                return 'denied';
            }
            if (Notification.permission === 'granted') {
                return 'granted';
            }
            if (Notification.permission === 'denied') {
                return 'denied';
            }

            const permission = await Notification.requestPermission();
            store.askedForNotificationPermission = true;
            return permission;
        }
    };

    const notifyTimerComplete = (isFocusComplete: boolean): void => {
        if (
            !('Notification' in window) ||
            Notification.permission !== 'granted'
        ) {
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
