/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        leetcode: {
          bg: '#1a1a1a',
          surface: '#262626',
          panel: '#202020',
          hover: '#2f2f2f',
          border: '#333333',
          borderSubtle: '#282828',
          accent: '#ffa116',
          accentHover: '#e08e14',
          easy: '#2cbb5d',
          medium: '#ffc01e',
          hard: '#ef4743',
          text: '#eff1f6',
          textMuted: '#9ca3af',
          textSubtle: '#6b7280',
        },
        brand: {
          500: '#ffa116',
          600: '#e08e14',
        }
      }
    },
  },
  plugins: [],
}
