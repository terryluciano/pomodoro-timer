/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                'main-red': '#C33149',
                'main-white': '#F8F1FF',
                'main-blue': '#56A3A6',
            },
            fontFamily: {
                Nunito: ['Nunito', 'Arial', 'serif'],
            },
        },
    },
    plugins: [],
}
