import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'PomoDoMore',
                short_name: 'PomoDoMore',
                description:
                    'A clean, focused Pomodoro timer to help you stay productive.',
                theme_color: '#ef4444',
                background_color: '#ef4444',
                display: 'standalone',
                start_url: '/',
                icons: [
                    {
                        src: '/tomato.svg',
                        sizes: 'any',
                        type: 'image/svg+xml',
                    },
                ],
            },
            workbox: {
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365,
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                    {
                        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'gstatic-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365,
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                ],
            },
            // devOptions: {
            //     enabled: true,
            // }
        }),
    ],
    server: {
        port: 4000,
    },
    resolve: {
        alias: {
            '@': '/src',
        },
    },
});
