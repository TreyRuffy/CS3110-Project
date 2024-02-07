// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  modules: [
    '@nuxt/image',
    '@nuxtjs/color-mode',
    '@nuxtjs/device',
    '@nuxtjs/eslint-module',
    '@nuxtjs/tailwindcss',
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
})
