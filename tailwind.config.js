/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        screens: {
            xs: '480px',
        },
        extend: {
            colors: {
                'main-focus': '#9C6A7B',
                'main-white': '#F8F9FA',
                'main-break': '#637C8E',
            },
            fontFamily: {
                Nunito: ['Nunito', 'Arial', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
