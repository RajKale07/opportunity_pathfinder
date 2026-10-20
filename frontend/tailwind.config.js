/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        leetcode: {
          bg: '#f7f8fa',
          surface: '#ffffff',
          panel: '#f0f1f4',
          hover: '#eceef1',
          border: '#e5e7eb',
          borderDark: '#111827',
          accent: '#111827',
          accentHover: '#262626',
          brand: '#ffa116',
          easy: '#00af9b',
          medium: '#ffb800',
          hard: '#ff2d55',
          text: '#111827',
          textMuted: '#4b5563',
          textSubtle: '#6b7280',
        },
      }
    },
  },
  plugins: [],
}
