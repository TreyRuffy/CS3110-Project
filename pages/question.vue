<script setup lang="ts">
const score = 12000
const questionNumber = 1
const maxQuestions = 10
</script>

<template>
  <div>
    <RoomTopNavigation
      :max-question-number="maxQuestions"
      :question-number="questionNumber"
      :score="score"
    />
    <h1 class="mb-2 mt-4 text-center text-2xl font-semibold">
      What country does this flag belong to?
    </h1>
    <div class="grid justify-center md:grid-cols-3">
      <div class="mx-8 flex items-center justify-center">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full bg-primary sm:h-24 sm:w-24"
        >
          120
        </div>
      </div>
      <div class="mx-8 flex justify-center">
        <NuxtImg src="https://flagcdn.com/us.svg" format="webp" :height="42" alt="United States" />
      </div>
      <div class="mx-8 flex items-center justify-center">
        <h1>Submitted 11/20</h1>
      </div>
      <h1>The buttons will be here</h1>
    </div>
  </div>
</template>
