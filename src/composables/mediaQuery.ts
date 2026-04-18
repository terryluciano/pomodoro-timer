import { useMediaQuery } from '@vueuse/core';

export const useIsDesktop = () => {
    return useMediaQuery('(min-width: 800px)');
};
