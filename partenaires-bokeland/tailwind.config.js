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
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9', // Sky blue from ruler
          600: '#0284c7', // Royal blue
          700: '#0369a1', // Deep blue
        },
        accent: {
          500: '#f59e0b', // Amber yellow from pencil
          600: '#d97706',
        },
        rose: {
          500: '#f43f5e', // Rose/pink from bookmark
          600: '#e11d48',
        },
        dark: {
          800: '#1e293b', // Slate charcoal from calculator
          900: '#0f172a',
          950: '#020617',
        }
      }
    },
  },
  plugins: [],
}

