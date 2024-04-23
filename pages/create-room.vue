<script setup lang="ts">
import { register } from 'swiper/element/bundle'
import TopNavigation from '~/components/TopNavigation.vue'

register()
</script>

<template>
  <div>
    <div class="min-h-dvh">
      <TopNavigation />
      <UiHeadingOne class="font-[600]">Create Multiplayer Room</UiHeadingOne>
      <RegionChoice :single-player="false" />
    </div>
    <TheFooter />
  </div>
</template>

<style scoped></style>
