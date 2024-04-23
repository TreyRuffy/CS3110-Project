<template>
  <div>
    <div class="box-border h-dvh">
      <RoomTopNavigation :question-number="0" :max-question-number="0" :score="0" />
      <div class="m-[2vh] mb-0 text-center">
        <UiHeadingOne class="font-[600]">Scoreboard</UiHeadingOne>
      </div>
      <div class="hidden text-right sm:block">
        <UiButtonTopRight>New Game</UiButtonTopRight>
      </div>
      <!--Container for screen under nav bar-->
      <div
        class="flex h-[calc(100vh-6rem-30vh)] flex-col justify-around overflow-hidden sm:h-[calc(100vh-8rem-28vh)] sm:flex-row"
      >
        <!--Begin First Column-->
        <UiPodiumContainer name="Name" :position="1" />
        <UiPodiumContainer name="Name" :position="2" />
        <UiPodiumContainer name="Name" :position="3" />
      </div>
      <div class="fixed w-full text-center sm:hidden">
        <UiButtonBottom class="mx-auto mt-8 flex justify-center">New Game</UiButtonBottom>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
