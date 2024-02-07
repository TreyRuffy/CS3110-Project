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
  <NuxtLink class="card card-compact w-96 bg-base-100 shadow-xl" :href="link">
    <figure>
      <NuxtImg :src="image" :alt="title" />
    </figure>
    <div class="card-body">
      <div class="card-title">
        {{ title }}
        <div
          v-if="newBadge"
          class="badge badge-secondary badge-sm invisible absolute sm:visible sm:relative"
        >
          NEW
        </div>
      </div>
      <div
        v-if="newBadge"
        class="badge badge-secondary badge-xs visible relative sm:invisible sm:absolute"
      >
        NEW
      </div>
      <p v-if="description" class="text-left">{{ description }}</p>
    </div>
  </NuxtLink>
</template>

<style scoped></style>
