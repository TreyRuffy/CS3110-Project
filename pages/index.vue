<script setup lang="ts"></script>

<template>
  <div>
    <div class="flex h-screen flex-col justify-center">
      <span class="mt-8 flex justify-center text-[36px] font-semibold"> Quizoot </span> <br />
      <div class="mb-44 flex flex-col items-center gap-2">
        <NuxtLink
          to="/singleplayer"
          class="btn btn-primary btn-md w-[90vw] text-[17px] font-medium shadow-sm md:btn-lg sm:mx-auto sm:max-w-md"
        >
          Single Player
        </NuxtLink>
        <NuxtLink
          to="/create-room"
          class="btn btn-secondary btn-md w-[90vw] text-[17px] font-medium shadow-sm md:btn-lg sm:mx-auto sm:max-w-md"
        >
          Create Room
        </NuxtLink>
        <NuxtLink
          to="/join"
          class="btn btn-accent btn-md w-[90vw] text-[17px] font-medium shadow-sm md:btn-lg sm:mx-auto sm:max-w-md"
        >
          Join Room
        </NuxtLink>
      </div>
    </div>
    <TheFooter />
  </div>
</template>

<style scoped></style>
