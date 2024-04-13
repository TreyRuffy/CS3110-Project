<script setup lang="ts"></script>

<template>
  <div>
    <span class="mt-8 grid text-center text-[36px] font-semibold"> Quizoot </span> <br />
    <div class="flex flex-col items-center gap-2">
      <NuxtLink
        to="/singleplayer"
        class="btn btn-primary btn-md w-[90vw] text-[17px] md:btn-lg sm:mx-auto sm:max-w-md"
      >
        Single Player
      </NuxtLink>
      <NuxtLink
        to="/create-room"
        class="btn btn-secondary btn-md w-[90vw] text-[17px] md:btn-lg sm:mx-auto sm:max-w-md"
      >
        Create Room
      </NuxtLink>
      <NuxtLink
        to="/join"
        class="btn btn-accent btn-md w-[90vw] text-[17px] md:btn-lg sm:mx-auto sm:max-w-md"
      >
        Join Room
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped></style>
