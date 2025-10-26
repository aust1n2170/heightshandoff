/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8A100B',
        secondary: '#B29D6C',
        accent: '#f59e0b',
      }
    },
  },
  plugins: [],
}