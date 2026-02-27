import { Howl } from 'howler';
import chimeSound from '@/assets/chime.mp3';
import clickSound from '@/assets/click.mp3';

/**
 * @type {Howl | null}
 */
let click;
/**
 * @type {Howl | null}
 */
let chime;

export const initializeAudio = () => {
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
export const playClick = () => {
    // @ts-ignore
    click?.play();
};

export const playChime = () => {
    // @ts-ignore
    chime?.play();
};
