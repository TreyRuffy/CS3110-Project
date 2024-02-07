/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [require('daisyui'), require('@tailwindcss/typography')],
  darkMode: 'class',
  content: ['components/**/*.{vue,js,ts}', 'pages/**/*.vue', 'layouts/**/*.vue'],
}
