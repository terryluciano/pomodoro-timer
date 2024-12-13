/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        screens: {
            xs: '480px',
        },
        extend: {
            colors: {
                'main-red': '#C33149',
                'main-white': '#F8F1FF',
                'main-blue': '#56A3A6',
            },
            fontFamily: {
                Nunito: ['Nunito', 'Arial', 'serif'],
            },
            boxShadow: {
                'button-default': '0 6px rgba(64, 64, 64, 0.5)',
                'button-active': '0 3px rgba(0, 0, 0, 0.5)',
            },
        },
    },
    plugins: [],
}
