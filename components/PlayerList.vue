<script setup lang="ts">
defineProps({
  players: {
    type: Array as PropType<string[]>,
    required: true,
  },
})
</script>

<template>
  <div class="grid grid-cols-1 gap-1 lg:grid-cols-3">
    <UiHeadingFour v-for="player in players" :key="player" class="overflow-x-clip">{{
      player
    }}</UiHeadingFour>
  </div>
</template>

<style scoped></style>
