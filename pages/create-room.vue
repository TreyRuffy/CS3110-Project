<script setup lang="ts">
import { register } from 'swiper/element/bundle'
import TopNavigation from '~/components/TopNavigation.vue'

register()
</script>

<template>
  <div>
    <div class="min-h-dvh">
      <TopNavigation />
      <UiTitle title="Create Multiplayer Room" />
      <RegionChoice :single-player="false" />
    </div>
    <TheFooter />
  </div>
</template>

<style scoped></style>
