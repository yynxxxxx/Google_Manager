/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // 自定义动画
            animation: {
                'bounce': 'bounce 1s ease-in-out infinite',
            }
        },
    },
    plugins: [],
}
