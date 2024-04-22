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
    <div class="min-h-dvh">
      <TopNavigation />
      <UiTitle title="Single Player" />
      <RegionChoice :single-player="true" />
    </div>
    <TheFooter />
  </div>
</template>
