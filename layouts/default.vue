<script setup lang="ts">
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

const socketStore = useSocketStore()
computed({
  get: () => socketStore.socket,
  set: (value) => {
    socketStore.socket = value
  },
})
</script>

<template>
  <div>
    <main>
      <slot />
      <ToastOverlay />
    </main>
  </div>
</template>

<style scoped></style>
