/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7f0',
          100: '#d9ead9',
          200: '#b3d6b3',
          300: '#8cc28c',
          400: '#66ad66',
          500: '#2d5a27',
          600: '#26512a',
          700: '#1f4822',
          800: '#183f1b',
          900: '#123614',
        },
        earth: {
          50: '#f7f3f0',
          100: '#ede2d9',
          200: '#dbc5b3',
          300: '#c9a88c',
          400: '#b78b66',
          500: '#8b4513',
          600: '#7d3e12',
          700: '#6f370f',
          800: '#61300d',
          900: '#53290b',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#ff8c00',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        }
      }
    },
  },
  plugins: [],
}