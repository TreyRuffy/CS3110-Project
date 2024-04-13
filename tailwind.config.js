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
          primary: '#18E399',
          'primary-content': '#001208',
          secondary: '#35ABDE',
          'secondary-content': '#010b12',
          accent: '#F371B4',
          'accent-content': '#130404',
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
