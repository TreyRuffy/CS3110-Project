<script setup lang="ts">
const singlePlayerStore = useSingleplayerStore()
singlePlayerStore.reset()
</script>

<template>
  <div>
    <div class="flex min-h-dvh flex-col justify-center">
      <h1 class="mt-8 flex justify-center text-[36px] font-semibold">Quizoot</h1>
      <br />
      <div class="mb-44 flex flex-col items-center gap-2">
        <UiButtonIndex to="/singleplayer">Single Player</UiButtonIndex>
        <UiButtonIndex class="btn-secondary" to="/create-room">Create Room</UiButtonIndex>
        <UiButtonIndex class="btn-accent" to="/join">Join Room</UiButtonIndex>
      </div>
    </div>
    <TheFooter />
  </div>
</template>

<style scoped></style>
