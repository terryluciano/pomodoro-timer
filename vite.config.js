import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        port: 8080,
        host: true,
        strictPort: true,
        origin: 'http://0.0.0.0:8080',
    },
})
