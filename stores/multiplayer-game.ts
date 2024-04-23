import { defineStore } from 'pinia'
import type { UUID } from '~/utils/socket-types'

export const useMultiplayerStore = defineStore('multiplayer', () => {
  const state = ref<'not-started' | 'in-question' | 'correct' | 'incorrect'>('not-started')

  const score = ref(0)
  const questionNumber = ref(0)
  const username = ref('')
  const uuid = ref<UUID | null>(null)
  const maxQuestions = ref(0)
  const timer = ref<ReturnType<typeof setTimeout> | null>(null)

  type Player = [uuid: UUID, username: string]
  const playerList = ref<Player[]>([])

  const roomCode = ref('')
  const host = ref(false)

  const allowAnswers = ref(false)
  const correctAnswer = ref('')
  const addedScore = ref(0)

  interface MultiPlayerQuestion {
    question: string
    image?: string
    answers: string[] | null
    peopleAnswered: UUID[] | null
    answerCount: { answer: string; count: number }[] | null
  }

  const multiPlayerQuestion = ref<MultiPlayerQuestion | null>(null)

  function reset() {
    state.value = 'not-started'
    score.value = 0
    questionNumber.value = 0
    username.value = ''
    uuid.value = null
    maxQuestions.value = 0
    if (timer.value) {
      clearTimeout(timer.value)
    }
    playerList.value = []
    roomCode.value = ''
    host.value = false
    allowAnswers.value = false
    correctAnswer.value = ''
    addedScore.value = 0
    multiPlayerQuestion.value = null
  }

  return {
    state,
    score,
    questionNumber,
    username,
    uuid,
    maxQuestions,
    timer,
    playerList,
    roomCode,
    host,
    allowAnswers,
    addedScore,
    correctAnswer,
    multiPlayerQuestion,
    reset,
  }
})
