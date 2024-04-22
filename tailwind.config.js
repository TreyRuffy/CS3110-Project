/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  darkMode: 'class',
  content: ['components/**/*.{vue,js,ts}', 'pages/**/*.vue', 'layouts/**/*.vue'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto'],
      },
    },
  },
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
        },
        fontFamily: 'Roboto',
      },
      {
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          primary: '#00a76e',
          'primary-content': '#000a04',
          secondary: '#0085b3',
          'secondary-content': '#00060c',
          accent: '#c7488d',
          'accent-content': '#0e0207',
        },
        fontFamily: 'Roboto',
      },
    ],
  },
}
