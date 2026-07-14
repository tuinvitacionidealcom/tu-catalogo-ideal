/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'selector',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                sans: ['Montserrat', 'sans-serif'],
            },
            colors: {
                brand: {
                    light: '#1E3A5F',
                    DEFAULT: '#0F2439',
                    dark: '#091525'
                },
                accent: {
                    light: '#5EC4D4',
                    DEFAULT: '#2BB5C7',
                    dark: '#1A8A9A'
                },
                slate: {
                    50: '#F8FAFC',
                    100: '#F1F5F9',
                    200: '#E2E8F0',
                    300: '#CBD5E1',
                    400: '#94A3B8',
                    500: '#64748B',
                    600: '#475569',
                    700: '#334155',
                    800: '#1E293B',
                    900: '#0F172A'
                }
            }
        },
    },
    plugins: [],
}
