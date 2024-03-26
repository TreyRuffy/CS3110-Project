<script setup lang="ts">
defineProps({
  players: {
    type: Array as PropType<string[]>,
    required: true,
  },
})
</script>

<template>
  <div>
    Players:
    <p v-for="player in players" :key="player">{{ player }}</p>
  </div>
</template>

<style scoped></style>
