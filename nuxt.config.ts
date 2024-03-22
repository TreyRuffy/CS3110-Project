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
    'nuxt-viewport',
    '@nuxtjs/eslint-module',
    '@vueuse/nuxt',
    'nuxt-simple-robots',
    '@nuxtjs/sitemap',
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
    provider: 'ipx',
    ipx: {
      maxAge: 31536000,
    },
  },
  colorMode: {
    classSuffix: '',
    preference: 'light',
    dataValue: 'theme',
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('swiper-'),
    },
  },
  site: {
    name: 'CS3110 Project',
    description: 'CS3110 Project',
  },
})
