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
      <div class="x-8 flex items-center justify-center">
        <!-- Timer for bigger screens -->
        <div
          class="hidden h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg md:flex lg:h-24 lg:w-24"
        >
          <span class="countdown absolute flex font-mono text-2xl lg:text-4xl">
            <span style="--value: 41"></span>
          </span>
        </div>
      </div>
      <div class="relative mx-8 flex justify-center">
        <NuxtImg src="https://flagcdn.com/us.svg" format="webp" :height="42" alt="United States" />
        <!-- Timer for smaller screens -->
        <div
          class="absolute start-[-8px] top-[50%] flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg md:hidden"
        >
          <span class="countdown flex font-mono text-2xl md:text-4xl">
            <span style="--value: 40"></span>
          </span>
        </div>
      </div>

      <!-- Submitted for larger screens -->
      <div class="mx-8 flex items-center justify-center">
        <h1>Submitted 11/20</h1>
      </div>
    </div>
    <!-- The answers are here -->
    <div class="mx-2 mt-4 grid grid-cols-2 gap-2">
      <div class="btn btn-primary btn-lg btn-block flex-grow shadow-md">answer 1</div>
      <div class="btn btn-secondary btn-lg btn-block flex-grow shadow-md">answer 2</div>
      <div class="btn btn-accent btn-lg btn-block flex-grow shadow-md">answer 3</div>
      <div class="btn btn-primary btn-lg btn-block flex-grow shadow-md">answer 4</div>
    </div>
  </div>
</template>
