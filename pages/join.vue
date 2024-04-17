<script setup lang="ts">
import TopNavigation from '~/components/TopNavigation.vue'

const route = useRoute()
const { roomCode: roomCodeParam, username: usernameParam } = route.query
const roomCode = ref(roomCodeParam)
const username = ref(usernameParam)

const roomCodeInput = ref<HTMLInputElement | null>(null)
const usernameInput = ref<HTMLInputElement | null>(null)
const inputError = ref<string | null>(null)

const connected = ref(false)
const response = ref([''])
const responseTimeout = ref(0)
const allowAnswers = ref(false)
const timeout = ref<unknown | null>(null)

const svgImage = ref('')
const question = ref('')
const answerList = ref([''])
const score = ref(0)

const chatMessage = ref('')

const socketStore = useSocketStore()
const socket = computed({
  get: () => socketStore.socket,
  set: (value) => {
    socketStore.socket = value
  },
})

function joinRoom() {
  usernameInput.value?.classList.remove('input-error')
  roomCodeInput.value?.classList.remove('input-error')
  inputError.value = null

  if (!roomCode.value) {
    roomCodeInput.value?.classList.add('input-error')
    inputError.value = 'Please enter a room code'
  }

  if (!username.value) {
    usernameInput.value?.classList.add('input-error')

    if (inputError.value) {
      inputError.value += ' and a username'
    } else {
      inputError.value = 'Please enter a username'
    }
  }

  if (!roomCode.value || !username.value) {
    return
  }

  socketStore.connect()
  socket.value?.emit('select-username', username.value + '')
  socket.value?.emit('join-room', roomCode.value + '')

  roomCode.value = null

  // TODO: redirect to waiting page with valid room code
}

watch(socket, () => {
  if (socket.value === null) {
    return
  }

  socket.value.on('connect', () => {
    connected.value = socket.value === null || socket.value.connected
  })

  socket.value.on('disconnect', () => {
    connected.value = socket.value === null || socket.value.connected
  })

  socket.value.on('successful-connection', (data) => {
    response.value.push(data)
  })

  socket.value.on('username-error', (errorType, errorMessage) => {
    response.value.push(errorType + ': ' + errorMessage)
  })

  socket.value.on('username-accepted', (username) => {
    response.value.push(username)
  })

  socket.value.on('room-joined', (roomCode) => {
    response.value.push(roomCode)
  })

  socket.value.on('room-created', (roomCode) => {
    response.value.push(roomCode)
  })

  socket.value.on('room-error', (errorType, errorMessage) => {
    response.value.push(errorType + ': ' + errorMessage)
  })

  socket.value.on('receive-chat-message', (username, message) => {
    response.value.push(username + ': ' + message)
  })

  socket.value.on('game-starting', (timer) => {
    response.value.push('Game starting in ' + timer / 1000 + ' seconds')
  })

  socket.value.on('game-started', (questionCount) => {
    response.value.push('Game started with ' + questionCount + ' questions')
  })

  socket.value.on('game-error', (errorType, errorMessage) => {
    response.value.push(errorType + ': ' + errorMessage)
  })

  socket.value.on('game-ended', () => {
    response.value.push('Game ended')
  })

  socket.value.on('question', (questionNumber, _question, answers, image) => {
    response.value.push(
      'Question ' + questionNumber + ': ' + _question + ' with answers ' + answers.join(', '),
    )

    printDelay(0)

    question.value = _question
    answerList.value = answers

    if (image) {
      svgImage.value = image
    }
  })

  socket.value.on('question-answered-correct', (answer) => {
    response.value.push('Correct answer: ' + answer)
    removeQuestion()
  })

  socket.value.on('question-answered-incorrect', (answer) => {
    response.value.push('Incorrect answer: ' + answer)
    removeQuestion()
  })

  socket.value.on('question-finished', (correctAnswer) => {
    response.value.push('Correct answer: ' + correctAnswer)
    removeQuestion()
  })

  socket.value.on('question-allow-answers', () => {
    response.value.push('Allowing answers')
    allowAnswers.value = true
    printDelay(10)
  })

  socket.value.on('room-player-update', (_, players) => {
    response.value.push('Players: ' + players.join(', '))
  })

  socket.value.on('room-left', () => {
    response.value.push('Left room')
  })

  socket.value.on('invalid-action', (message) => {
    response.value.push('Invalid action: ' + message)
  })
})

function printDelay(seconds: number) {
  if (seconds === 0) {
    return
  }

  if (timeout.value) {
    clearTimeout(timeout.value as number)
    timeout.value = null
  }

  responseTimeout.value = seconds
  timeout.value = setTimeout(() => {
    printDelay(seconds - 1)
  }, 1000)
}

function removeQuestion() {
  question.value = ''
  answerList.value = ['']
  svgImage.value = ''
  responseTimeout.value = 0
  allowAnswers.value = false
}

function answerQuestion(answer: number) {
  if (!socket.value) {
    return
  }

  socket.value.emit('question-answer', answerList.value[answer - 1])
}
</script>

<template>
  <div>
    <TopNavigation />
    <div>
      <div class="mt-8 h-screen">
        <div class="flex items-center">
          <div class="card mx-auto w-full max-w-2xl lg:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.25)]">
            <form class="px-10 py-10" method="dialog" @submit="joinRoom()">
              <h2 class="mb-4 text-center text-2xl font-semibold">Join Room</h2>
              <label
                ref="roomCodeInput"
                for="room-code"
                class="input input-bordered mt-6 flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="h-5 w-5"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9.493 2.852a.75.75 0 0 0-1.486-.204L7.545 6H4.198a.75.75 0 0 0 0 1.5h3.14l-.69 5H3.302a.75.75 0 0 0 0 1.5h3.14l-.435 3.148a.75.75 0 0 0 1.486.204L7.955 14h2.986l-.434 3.148a.75.75 0 0 0 1.486.204L12.456 14h3.346a.75.75 0 0 0 0-1.5h-3.14l.69-5h3.346a.75.75 0 0 0 0-1.5h-3.14l.435-3.148a.75.75 0 0 0-1.486-.204L12.045 6H9.059l.434-3.148ZM8.852 7.5l-.69 5h2.986l.69-5H8.852Z"
                    clip-rule="evenodd"
                  />
                </svg>

                <input
                  id="room-code"
                  v-model="roomCode"
                  type="text"
                  placeholder="Room code"
                  class="grow"
                  :maxlength="6"
                  oninput="this.value = this.value.toUpperCase()"
                />
              </label>

              <label
                ref="usernameInput"
                for="username"
                class="input input-bordered mt-2 flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="h-5 w-5"
                >
                  <path
                    d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z"
                  />
                </svg>

                <input
                  id="username"
                  v-model="username"
                  type="text"
                  placeholder="Username"
                  class="grow"
                  :maxlength="32"
                />
              </label>
              <p v-if="inputError !== null" class="mt-4 justify-center text-center text-red-600">
                {{ inputError }}
              </p>
              <span class="flex justify-center" :class="inputError !== null ? 'mt-4' : 'mt-8'">
                <input type="submit" class="btn btn-primary w-full px-8 text-[16px]" value="Join" />
              </span>
            </form>
          </div>
        </div>
        <div>
          <ClientOnly>
            <span> Connected?: {{ connected }} </span>
          </ClientOnly>
          <button v-if="!connected" class="btn btn-secondary m-2" @click="socketStore.connect()">
            Connect
          </button>
          <br />
          <button
            v-if="connected"
            class="btn btn-accent m-2"
            @click="socket && socket.emit('create-room')"
          >
            Create Room
          </button>
          <button
            v-if="connected"
            class="btn btn-accent m-2"
            @click="socket && socket.emit('leave-room')"
          >
            Leave Room
          </button>
          <button
            v-if="connected"
            class="btn btn-accent m-2"
            @click="socket && socket.emit('host-start-game')"
          >
            Start Game
          </button>
          <button
            v-if="connected"
            class="btn btn-accent m-2"
            @click="socket && socket.emit('question-next')"
          >
            Next Question
          </button>
          <br />
          <input
            v-if="connected"
            v-model="chatMessage"
            type="text"
            placeholder="Send a chat message"
            class="input input-bordered w-full max-w-xs"
            :maxlength="256"
          />
          <button
            v-if="connected"
            class="btn btn-primary m-2"
            @click="
              () => {
                if (socket) {
                  socket.emit('send-chat-message', chatMessage)
                  chatMessage = ''
                }
              }
            "
          >
            Send Message
          </button>
          <br />
          <div>
            <h2>Score: {{ score }}</h2>
          </div>
          <br />
          <div>
            <h2>Remaining Time: {{ responseTimeout }}</h2>
          </div>
          <div v-if="svgImage">
            <img :src="svgImage" alt="Country Flag" width="200" :draggable="false" />
          </div>
          <div v-if="answerList[0] !== '' && answerList.length > 1">
            <p>{{ question }}</p>
          </div>
          <div v-if="answerList[0] !== '' && answerList.length > 1 && allowAnswers">
            <button
              v-for="answer in answerList"
              :key="answer"
              class="btn btn-success m-1"
              @click="answerQuestion(answerList.indexOf(answer) + 1)"
            >
              {{ answer }}
            </button>
          </div>
          <br />
          <div class="max-w-[95vw]">
            Response: <br />
            <div v-for="resp in response" :key="resp" class="break-all">{{ resp }}</div>
          </div>
        </div>
      </div>
    </div>
    <TheFooter />
  </div>
</template>

<style scoped></style>
