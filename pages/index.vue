<script setup lang="ts">
import { register } from 'swiper/element/bundle'
import { CountriesBuilder, createQuestions } from '~/utils/countries'

register()

definePageMeta({
  title: 'Home',
  description: 'Home Page - CS3110 Project',
})

const connected = ref(false)
const response = ref([''])
const svgImage = ref('')
const disableButton = ref(false)
const answerList = ref([''])
const score = ref(0)
let client = false
let correctClientAnswer = ''

const socketStore = useSocketStore()
const socket = computed({
  get: () => socketStore.socket,
  set: (value) => {
    socketStore.socket = value
  },
})

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
  socket.value.on('hello-response', (id: string, data: string, time: string) => {
    response.value.push(id + ' [' + time + ']: ' + data)
  })
  socket.value.on('dark', (data: boolean) => {
    useColorMode().preference = data ? 'dark' : 'light'
  })
  socket.value.on('question', ({ answers, image }) => {
    // response.value.push(question + ' [' + answers + ']')
    if (image) {
      svgImage.value = image
    }
    disableButton.value = false
    answerList.value = answers
    client = false
  })
  socket.value.on('score', (_score: number) => {
    score.value = _score
  })
  socket.value.on('wrong-answer', (data: string) => {
    response.value.push('Wrong answer: ' + data)
  })
})

const username = ref('')
function setUsername() {
  if (socket.value !== null && username && username.value !== '') {
    socket.value.emit('new-username', username.value)
  }
  username.value = ''
}

function generateQuestion() {
  if (socket.value === null) {
    return
  }
  disableButton.value = true
  socket.value.emit('generate-question')
  client = false
}

function shuffle<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }

  return array
}

function generateClientQuestion() {
  disableButton.value = true
  const countries = new CountriesBuilder()
  countries.all()
  countries.build().then((countries) => {
    const q = createQuestions(countries, 1)[0]
    if (q.image) {
      svgImage.value = q.image
    }
    disableButton.value = false
    answerList.value = shuffle(q.answers.flat())
    correctClientAnswer = q.answers[0]
  })
  client = true
}

function answerQuestion(answer: number) {
  if (client || socket.value === null) {
    if (answerList.value[answer - 1] === correctClientAnswer) {
      score.value++
      generateClientQuestion()
    } else {
      response.value.push('Wrong answer: ' + answerList.value[answer - 1])
    }
  } else {
    socket.value.emit('answer', answerList.value[answer - 1])
  }
}
</script>

<template>
  <div>
    <p>Home page</p>
    <RegionChoice :single-player="true" />
    <div>
      <label for="page-color">
        Color mode: <ClientOnly>{{ $colorMode.value }} </ClientOnly>
      </label>
      <br />

      <select id="page-color" v-model="$colorMode.preference">
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="sepia">Sepia</option>
      </select>
    </div>
    <div>Connected?: {{ connected }}</div>
    <button class="btn btn-primary m-2" @click="socketStore.connect()">Connect</button>
    <button class="btn btn-success m-2" @click="socket && socket.emit('hello', 'Hello World')">
      Hello World
    </button>
    <button
      class="btn btn-error m-2"
      @click="socket && socket.emit('all-dark', useColorMode().preference !== 'dark')"
    >
      All Dark
    </button>
    <NuxtLink href="/waiting-room" class="btn btn-primary m-2"> Waiting Room </NuxtLink>
    <br />
    <input
      v-model="username"
      type="text"
      placeholder="Set new username"
      class="input input-bordered w-full max-w-xs"
    />
    <button class="btn btn-primary m-2" @click="setUsername()">Set username</button>
    <br />
    <button
      v-if="socket"
      class="btn btn-warning m-2"
      :disabled="disableButton"
      @click="generateQuestion()"
    >
      Generate Question
    </button>
    <button class="btn btn-warning m-2" :disabled="disableButton" @click="generateClientQuestion()">
      Generate Client-Side Question
    </button>
    <div v-if="svgImage">
      <img :src="svgImage" alt="Country Flag" width="200" :draggable="false" />
    </div>
    <br />
    <div>
      <h2>Score: {{ score }}</h2>
    </div>
    <div v-if="answerList[0] !== '' && answerList.length > 1">
      <button
        v-for="answer in answerList"
        :key="answer"
        class="btn btn-success m-1"
        :disabled="disableButton"
        @click="answerQuestion(answerList.indexOf(answer) + 1)"
      >
        {{ answer }}
      </button>
    </div>
    <div>
      Response: <br />
      <div v-for="resp in response" :key="resp">{{ resp }}</div>
    </div>
  </div>
</template>
