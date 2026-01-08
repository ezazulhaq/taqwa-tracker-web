/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#059669', // emerald-600
          dark: '#10b981',    // emerald-500
        }
      },
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

