import { defineStore } from 'pinia'
import type { Question } from '~/utils/utils'

export const useSingleplayerStore = defineStore('singleplayer', () => {
  const score = ref(0)
  const questionNumber = ref(1)
  const maxQuestions = ref(100000)
  const questions = ref<Question[]>([])
  const timer = ref<ReturnType<typeof setTimeout> | null>(null)

  const state = ref<'not-started' | 'in-question' | 'correct' | 'incorrect'>('not-started')
  const region = ref('world')
  const addedScore = ref(0)

  function reset() {
    score.value = 0
    questionNumber.value = 1
    maxQuestions.value = 100000
    questions.value = []
    if (timer.value) {
      clearTimeout(timer.value)
    }
    state.value = 'not-started'
    addedScore.value = 0
  }

  return {
    score,
    questionNumber,
    questions,
    maxQuestions,
    timer,
    state,
    region,
    addedScore,
    reset,
  }
})
