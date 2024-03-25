<script setup lang="ts">
import TopNavigation from '~/components/TopNavigation.vue'

const route = useRoute()

useHead({
  titleTemplate: route.meta.title ? `${route.meta.title} - CS3110 Project` : 'CS3110 Project',
  meta: [
    {
      name: 'description',
      content: 'CS3110 Project',
    },
    {
      name: 'author',
      content: 'CS3110 Group 5',
    },
    {
      name: 'keywords',
      content: 'CS3110, Project, Group 5',
    },
  ],
  htmlAttrs: {
    lang: 'en',
  },
})
</script>

<template>
  <div>
    <TopNavigation />
    <main>
      <slot />
    </main>
  </div>
</template>

<style scoped></style>
