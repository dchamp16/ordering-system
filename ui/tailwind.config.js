/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            animation: {
                'spin-slow': 'spin 3s linear infinite',
            },
            boxShadow: {
                'inner-lg': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
            },
        },
    },
    plugins: [],
}