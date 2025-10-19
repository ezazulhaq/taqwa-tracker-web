/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'indopak': ['IndoPak', 'sans-serif'],
        'app-serif': ['"PT Serif"', 'serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}

