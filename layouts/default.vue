<script setup lang="ts">
const route = useRoute()

useHead({
  titleTemplate: route.meta.title ? `${route.meta.title} - CS3110 Project` : 'CS3110 Project',
  meta: [
    {
      name: 'description',
      content: 'CS3110 Project',
    },
    {
      name: 'author',
      content: 'CS3110 Group 5',
    },
    {
      name: 'keywords',
      content: 'CS3110, Project, Group 5',
    },
  ],
  htmlAttrs: {
    lang: 'en',
  },
})

const socketStore = useSocketStore()
const socket = computed({
  get: () => socketStore.socket,
  set: (value) => {
    socketStore.socket = value
  },
})

const router = useRouter()

const multiplayerStore = useMultiplayerStore()
const toast = useToastStore()

function countdownTimer(initialTime: number) {
  multiplayerStore.timer = initialTime
  multiplayerStore.timeOut = setInterval(() => {
    if (!multiplayerStore.timeOut || multiplayerStore.timer <= 0) {
      multiplayerStore.resetTimer()
    }
    if (multiplayerStore.timer) multiplayerStore.timer--
  }, 1000)
}

watch(socket, () => {
  if (socket.value === null) {
    return
  }

  socket.value.on('successful-connection', (uuid) => {
    multiplayerStore.uuid = uuid
  })

  socket.value.on('invalid-action', (message) => {
    toast.addToast({
      title: 'Error',
      message,
      type: 'error',
    })
  })

  socket.value?.on('player-kicked', (uuid) => {
    toast.addToast({
      title: 'User kicked',
      message: `User with UUID ${uuid} has been kicked from the room.`,
      type: 'info',
    })
  })

  socket.value?.on('self-kicked', () => {
    toast.addToast({
      title: 'Kicked',
      message: 'You have been kicked from the room.',
      type: 'error',
    })
    multiplayerStore.reset()
    router.push('/')
  })

  socket.value?.on('player-banned', (uuid) => {
    toast.addToast({
      title: 'User banned',
      message: `User with UUID ${uuid} has been banned from the room.`,
      type: 'info',
    })
  })

  socket.value?.on('self-banned', () => {
    toast.addToast({
      title: 'Banned',
      message: 'You have been banned from the room.',
      type: 'error',
    })
    multiplayerStore.reset()
    router.push('/')
  })

  socket.value?.on('game-starting', (timer) => {
    console.log('game-starting', timer)
  })

  socket.value?.on('game-started', (questionCount) => {
    multiplayerStore.maxQuestions = questionCount
    router.replace('/question')
  })

  socket.value?.on('user-info', (_username, _uuid, _roomCode, _roomHost, _score) => {
    multiplayerStore.uuid = _uuid
    multiplayerStore.host = _roomHost
    multiplayerStore.roomCode = _roomCode
    multiplayerStore.score = _score
  })

  socket.value?.on('room-player-update', (_, players) => {
    multiplayerStore.playerList = players
  })

  socket.value?.on('question', (_questionNumber, question, image) => {
    router.replace('/question')
    multiplayerStore.allowAnswers = false
    multiplayerStore.multiPlayerQuestion = {
      question,
      image,
      answers: null,
      peopleAnswered: null,
      answerCount: null,
    }
    multiplayerStore.state = 'in-question'
    multiplayerStore.questionNumber = _questionNumber
    multiplayerStore.correctAnswer = ''
  })

  socket.value?.on('question-allow-answers', (answers, timer) => {
    if (!multiplayerStore.multiPlayerQuestion) return
    multiplayerStore.allowAnswers = true
    multiplayerStore.multiPlayerQuestion!.answers = answers
    countdownTimer(timer / 1000)
  })

  socket.value?.on('question-answered-incorrect', (score, correctAnswer) => {
    multiplayerStore.state = 'incorrect'
    multiplayerStore.correctAnswer = correctAnswer
    multiplayerStore.score = score
    if (multiplayerStore.host) {
      router.replace('/question-answer')
    } else {
      router.replace('/question-response')
    }
  })

  socket.value?.on('question-answered-correct', (score, addedScore, correctAnswer) => {
    multiplayerStore.state = 'correct'
    multiplayerStore.correctAnswer = correctAnswer
    multiplayerStore.addedScore = addedScore
    multiplayerStore.score = score
    if (multiplayerStore.host) {
      router.replace('/question-answer')
    } else {
      router.replace('/question-response')
    }
  })

  socket.value?.on('question-people-answered', (peopleAnswered) => {
    if (!multiplayerStore.multiPlayerQuestion) return
    multiplayerStore.multiPlayerQuestion.peopleAnswered = peopleAnswered
  })

  socket.value?.on('question-answer-count', (answerCount) => {
    if (!multiplayerStore.multiPlayerQuestion) return
    multiplayerStore.multiPlayerQuestion.answerCount = answerCount
  })

  socket.value?.on('game-error', (errorType, message) => {
    if (errorType === 'game-not-enough-players') {
      multiplayerStore.resetGame()
      router.push('/waiting-room')
    }
    toast.addToast({
      title: 'Error',
      message,
      type: 'error',
    })
  })

  socket.value?.on('game-ended', (rankings) => {
    multiplayerStore.state = 'finished'
    multiplayerStore.rankings = rankings
    router.replace('/scoreboard')
  })

  socket.value?.on('game-restarted', () => {
    multiplayerStore.resetGame()
    router.push('/waiting-room')
  })

  socket.value?.on('room-left', () => {
    multiplayerStore.reset()
    router.replace('/')
  })
})
</script>

<template>
  <div>
    <main>
      <slot />
      <ToastOverlay />
    </main>
  </div>
</template>

<style scoped></style>
