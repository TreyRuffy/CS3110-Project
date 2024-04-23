<script setup lang="ts">
const singlePlayerStore = useSingleplayerStore()
singlePlayerStore.reset()
</script>

<template>
  <div>
    <div class="flex min-h-dvh flex-col justify-center">
      <div class="mt-8 text-center text-5xl font-[500]">Quizoot</div>
      <br />
      <div class="mb-44 flex flex-col items-center gap-2">
        <UiButtonHome class="btn-primary" to="/singleplayer">Single Player</UiButtonHome>
        <UiButtonHome class="btn-secondary" to="/create-room">Create Room</UiButtonHome>
        <UiButtonHome class="btn-accent" to="/join">Join Room</UiButtonHome>
      </div>
    </div>
    <TheFooter />
  </div>
</template>

<style scoped></style>
