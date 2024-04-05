<script setup lang="ts">
import { register } from 'swiper/element/bundle'
import TopNavigation from '~/components/TopNavigation.vue'

register()
</script>

<template>
  <div>
    <TopNavigation />
    <h1 class="mb-2 mt-4 text-center text-2xl font-semibold">Create Multiplayer Room</h1>
    <RegionChoice :single-player="false" />
  </div>
</template>

<style scoped></style>
