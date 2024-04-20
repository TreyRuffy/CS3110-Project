<script setup lang="ts">
const score = 12000
const questionNumber = 1
const maxQuestions = 10
</script>

<template>
  <div class="flex h-dvh flex-col">
    <div class="mb-4">
      <RoomTopNavigation
        :max-question-number="maxQuestions"
        :question-number="questionNumber"
        :score="score"
      />
    </div>
    <!-- Next Question Button Large Screens -->
    <div class="hidden text-right md:block">
      <UiButtonTopRight>Next Question</UiButtonTopRight>
    </div>
    <div class="mb-32 flex flex-grow flex-col justify-center">
      <!-- Correct Answer-->
      <div class="justify-center">
        <h1 class="mb-2 text-center text-2xl font-semibold">Correct answer: India</h1>
        <!-- Aligning the 3 cards in the middle of the page -->
        <div class="mx-3 grid md:mx-0 md:grid-cols-3">
          <!-- Empty div -->
          <div></div>
          <!-- Creating 4 different cards in a row -->
          <div class="grid gap-2">
            <div class="card w-auto bg-primary shadow-md">
              <QuestionAnswerCard :num-answers="11" country-choice="Ireland" />
            </div>
            <div class="card w-auto bg-secondary shadow-md">
              <QuestionAnswerCard :num-answers="5" country-choice="India" />
            </div>
            <div class="card w-auto bg-accent shadow-md">
              <QuestionAnswerCard :num-answers="2" country-choice="Greenland" />
            </div>
            <div class="card w-auto bg-[#FCC93B] shadow-md">
              <QuestionAnswerCard :num-answers="3" country-choice="Australia" />
            </div>
          </div>
          <!-- Empty div -->
          <div></div>
          <!-- Next Question Button Smaller Screens -->
          <div class="mt-8 flex justify-center">
            <UiButtonBottom>Next Question</UiButtonBottom>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
