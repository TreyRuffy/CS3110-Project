<script setup lang="ts">
import { register } from 'swiper/element/bundle'

register()
</script>

<template>
  <div>
    <h1>Create Room</h1>
    <RegionChoice :single-player="false" />
  </div>
</template>

<style scoped></style>
