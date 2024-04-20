<script setup lang="ts">
const score = 12000
const questionNumber = 1
const maxQuestions = 10
type ResponseState = 'waiting' | 'correct' | 'incorrect'

defineProps({
  responseState: {
    type: String as PropType<ResponseState>,
    default: 'waiting',
  },
})
</script>

<template>
  <div
    class="flex h-dvh flex-col justify-center"
    :class="[
      responseState === 'correct'
        ? 'bg-green-300'
        : responseState === 'incorrect'
          ? 'bg-red-400'
          : '',
    ]"
  >
    <div>
      <RoomTopNavigation
        :max-question-number="maxQuestions"
        :question-number="questionNumber"
        :score="score"
      />
    </div>
    <div class="mb-24 flex flex-grow items-center justify-center">
      <div v-if="responseState === 'waiting'" class="flex text-4xl">
        <span> Waiting</span>
        <CSSLoader class="ml-1 mt-1" />
      </div>
      <div v-else-if="responseState === 'correct'" class="text-center text-4xl">
        Correct!
        <div>+98</div>
      </div>
      <div v-else-if="responseState === 'incorrect'" class="text-4xl">Incorrect</div>
    </div>
  </div>
</template>
