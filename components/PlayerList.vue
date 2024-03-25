<script setup lang="ts">
function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}
</script>

<template>
  <h1>Room code: {{ generateRoomCode() }}</h1>
  <h1>Players: INSERT PLAYER LIST HERE</h1>
</template>

<style scoped></style>
