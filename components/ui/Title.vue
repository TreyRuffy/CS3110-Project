<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <h1 class="mb-2 mt-4 text-center text-2xl font-semibold sm:text-3xl">{{ title }}</h1>
</template>

<style scoped></style>
