<script setup lang="ts"></script>

<template>
  <div>
    <div class="flex h-dvh flex-col justify-center">
      <span class="mt-8 flex justify-center text-[36px] font-semibold"> Quizoot </span> <br />
      <div class="mb-44 flex flex-col items-center gap-2">
        <NuxtLink to="/singleplayer"> <UiButtonIndex>Single Player</UiButtonIndex> </NuxtLink>
        <NuxtLink to="/create-room">
          <UiButtonIndex class="btn-secondary">Create Room</UiButtonIndex>
        </NuxtLink>
        <NuxtLink to="/join"><UiButtonIndex class="btn-accent">Join Room</UiButtonIndex></NuxtLink>
      </div>
    </div>
    <TheFooter />
  </div>
</template>

<style scoped></style>
