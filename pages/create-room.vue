<script setup lang="ts">
import { register } from 'swiper/element/bundle'

register()
</script>

<template>
  <div>
    <h1 class="mb-2 mt-4 text-center text-2xl font-semibold">Create Room</h1>
    <RegionChoice :single-player="false" />
  </div>
</template>

<style scoped></style>
