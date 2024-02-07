// https://nuxt.com/docs/api/configuration/nuxt-config

const routerBase = process.env.GH_PAGES ? '/CS3110-Project/' : '/'

export default defineNuxtConfig({
  app: {
    baseURL: routerBase,
    buildAssetsDir: 'assets',
  },
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  modules: [
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxtjs/device',
    '@nuxtjs/eslint-module',
    '@vueuse/nuxt',
    'vue3-carousel-nuxt',
  ],
  experimental: {
    payloadExtraction: false,
  },
  typescript: {
    strict: true,
    typeCheck: true,
  },

  image: {
    quality: 90,
  },
  colorMode: {
    classSuffix: '',
    preference: 'light',
    dataValue: 'theme',
  },
})
