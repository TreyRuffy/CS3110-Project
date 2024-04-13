<script setup lang="ts">
defineProps({
  questionNumber: {
    type: Number,
    required: true,
  },
  maxQuestionNumber: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <div>
    <div class="navbar bg-base-200">
      <div class="navbar-start">
        <span v-if="questionNumber !== 0">{{ questionNumber }}/{{ maxQuestionNumber }}</span>
        <span v-else></span>
      </div>
      <div class="navbar-center">
        <span v-if="questionNumber !== 0">Score: {{ score }}</span>
        <span v-else></span>
      </div>
      <div class="navbar-end">
        <a class="btn btn-ghost btn-md text-[16px]"> Exit </a>
      </div>
    </div>
  </div>
</template>
