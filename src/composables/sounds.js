import { Howl } from 'howler';
import chimeSound from '@/assets/chime.mp3';
import clickSound from '@/assets/click.mp3';
import { useStore } from '@/store/store';

export const useSound = () => {
    const store = useStore();

    const click = new Howl({
        src: [clickSound],
        volume: (store.masterVolume / 100) * (store.clickVolume / 100),
        loop: false,
    });

    const chime = new Howl({
        src: [chimeSound],
        volume: (store.masterVolume / 100) * (store.alarmVolume / 100),
        loop: false,
    });

    const playClick = () => {
        click.volume((store.masterVolume / 100) * (store.clickVolume / 100));
        click.play();
    };

    const playChime = () => {
        chime.volume((store.masterVolume / 100) * (store.alarmVolume / 100));
        chime.play();
    };

    return { playClick, playChime };
};
