<script setup lang="ts">
defineProps({
  roomCode: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div>Room Code: {{ roomCode }}</div>
</template>

<style scoped></style>
