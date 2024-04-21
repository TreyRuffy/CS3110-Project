<script setup lang="ts">
const singlePlayerStore = useSingleplayerStore()
singlePlayerStore.reset()
</script>

<template>
  <div>
    <div class="flex h-dvh flex-col justify-center">
      <span class="mt-8 flex justify-center text-[36px] font-semibold"> Quizoot </span> <br />
      <div class="mb-44 flex flex-col items-center gap-2">
        <UiButtonIndex to="/singleplayer">Single Player</UiButtonIndex>
        <UiButtonIndex class="btn-secondary" to="/create-room">Create Room</UiButtonIndex>
        <UiButtonIndex class="btn-accent" to="/join">Join Room</UiButtonIndex>
      </div>
      <UiButtonBottom
        @click="
          useToastStore().addToast({
            title: 'Welcome to Quizoot!',
            message: 'Enjoy!',
            type: 'info',
          })
        "
      >
        Test
      </UiButtonBottom>
    </div>
    <TheFooter />
  </div>
</template>

<style scoped></style>
