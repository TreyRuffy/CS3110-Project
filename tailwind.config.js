/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  darkMode: 'class',
  content: ['components/**/*.{vue,js,ts}', 'pages/**/*.vue', 'layouts/**/*.vue'],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          primary: '#66cc8a',
          'primary-content': '#0C271B',
          secondary: '#377cfb',
          'secondary-content': 'oklch(100% 0 0)',
          accent: '#f68067',
          'accent-content': '#000',
          neutral: '#333c4d',
          'neutral-content': '#f9fafb',
          'base-100': 'oklch(100% 0 0)',
          'base-content': '#333c4d',
        },
      },
      'dark',
    ],
  },
}
