/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { 50: '#fef3e2', 100: '#fde4c4', 200: '#fbd49a', 300: '#f8bc65', 400: '#f59e2e', 500: '#ed7d0e', 600: '#d45f09', 700: '#af460b', 800: '#8c3710', 900: '#732f10', 950: '#3e1506' },
        dark: { 800: '#1a1a2e', 900: '#0f0f1a' },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
