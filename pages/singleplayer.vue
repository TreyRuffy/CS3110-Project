<script setup lang="ts">
import { register } from 'swiper/element/bundle'
register()

definePageMeta({
  title: 'Home',
  description: 'Home Page - CS3110 Project',
})
</script>

<template>
  <div>
    <div class="h-dvh">
      <TopNavigation />
      <h1 class="mb-2 mt-4 text-center text-2xl font-semibold">Single Player</h1>
      <RegionChoice :single-player="true" />
    </div>
    <TheFooter />
  </div>
</template>
