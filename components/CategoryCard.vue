<script setup lang="ts">
defineProps({
  image: {
    type: String,
    required: true,
  },
  svg: {
    type: String,
    default: null,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: null,
  },
  link: {
    type: String,
    required: true,
  },
  newBadge: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <NuxtLink :href="link" class="card card-compact w-96 rounded-2xl bg-base-100 shadow-xl">
    <NuxtImg
      :src="image"
      :alt="title"
      class="rounded-t-2xl"
      :width="400"
      :height="175"
      format="webp"
    />
    <div class="card-body">
      <div class="card-title">
        {{ title }}
        <div v-if="newBadge" class="badge badge-secondary badge-sm">NEW!</div>
      </div>
      <p v-if="description" class="text-left">{{ description }}</p>
    </div>
  </NuxtLink>
</template>

<style scoped></style>
