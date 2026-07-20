/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./js/**/*.js",
    "./api/**/*.js",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        'v-black': '#020205',
        'v-dark': '#0b0b10',
        'v-border': '#151522',
        'v-muted': '#a1a1aa',
        'v-orange': '#f97316',
      },
    },
  },
  plugins: [],
}