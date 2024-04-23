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

watch(socket, () => {
  if (socket.value === null) {
    return
  }

  socket.value.on('invalid-action', (message) => {
    toast.addToast({
      title: 'Error',
      message,
      type: 'error',
    })
  })

  socket.value?.on('game-starting', (timer) => {
    console.log('game-starting', timer)
  })

  socket.value?.on('game-started', (questionCount) => {
    if (multiplayerStore.host) {
      console.log('game-started', questionCount)
    }
    router.push('/question')
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
    multiplayerStore.multiPlayerQuestion = {
      question,
      image,
      answers: null,
      peopleAnswered: null,
      answerCount: null,
    }
  })

  socket.value?.on('question-allow-answers', (answers) => {
    if (!multiplayerStore.multiPlayerQuestion) return
    multiplayerStore.allowAnswers = true
    multiplayerStore.multiPlayerQuestion!.answers = answers
  })

  socket.value?.on('question-answered-incorrect', (score, correctAnswer) => {
    multiplayerStore.score = score
    multiplayerStore.state = 'incorrect'
    multiplayerStore.correctAnswer = correctAnswer
    if (multiplayerStore.host) {
      router.replace('/question-answer')
    } else {
      router.replace('/question-response')
    }
  })

  socket.value?.on('question-answered-correct', (score) => {
    multiplayerStore.score = score
    multiplayerStore.state = 'correct'
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
      toast.addToast({
        title: 'Error',
        message,
        type: 'error',
      })
      multiplayerStore.resetGame()
      router.push('/waiting-room')
    }
  })

  socket.value?.on('game-ended', () => {
    multiplayerStore.state = 'finished'
    router.push('/scoreboard')
  })

  socket.value?.on('room-left', () => {
    multiplayerStore.reset()
    router.push('/')
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
