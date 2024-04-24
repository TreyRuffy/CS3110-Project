import { defineStore } from 'pinia'
import type { UUID } from '~/utils/socket-types'

export const useMultiplayerStore = defineStore('multiplayer', () => {
  const state = ref<
    'not-started' | 'in-room' | 'in-question' | 'correct' | 'incorrect' | 'finished'
  >('not-started')

  const score = ref(0)
  const questionNumber = ref(0)
  const username = ref('')
  const uuid = ref<UUID | null>(null)
  const maxQuestions = ref(0)
  const timer = ref<number>(0)
  const timeOut = ref<ReturnType<typeof setTimeout> | null>(null)

  type Player = [uuid: UUID, username: string]
  const playerList = ref<Player[]>([])
  const rankings = ref<{ uuid: UUID; username: string; score: number }[]>([])

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

  function resetTimer() {
    if (timeOut.value) {
      clearTimeout(timeOut.value)
    }
    timer.value = 0
    timeOut.value = null
  }

  function resetGame() {
    state.value = 'in-room'
    score.value = 0
    questionNumber.value = 0
    resetTimer()
    rankings.value = []
    allowAnswers.value = false
    correctAnswer.value = ''
    addedScore.value = 0
    multiPlayerQuestion.value = null
  }

  function reset() {
    state.value = 'not-started'
    score.value = 0
    questionNumber.value = 0
    username.value = ''
    uuid.value = null
    maxQuestions.value = 0
    resetTimer()
    playerList.value = []
    rankings.value = []
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
    timeOut,
    playerList,
    rankings,
    roomCode,
    host,
    allowAnswers,
    addedScore,
    correctAnswer,
    multiPlayerQuestion,
    resetTimer,
    resetGame,
    reset,
  }
})
