<script setup lang="ts">
import { createQuestions } from '~/utils/countries'

interface Question {
  question: string
  answers: [correct: string, wrong: string[]]
  image?: string
}

type CardItem = {
  title: string
  link: string
  image: string
  description: string
  newBadge: boolean
}
const world: CardItem[] = [
  {
    title: 'World',
    link: '/',
    image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
    description: 'Countries all over the world.',
    newBadge: true,
  },
]

const continents: CardItem[] = [
  {
    title: 'Africa',
    link: '/',
    image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
    description: 'Countries specific to Africa.',
    newBadge: true,
  },
  {
    title: 'Americas',
    link: '/',
    image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
    description: 'Countries specific to North and South America.',
    newBadge: true,
  },
  {
    title: 'Asia',
    link: '/',
    image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
    description: 'Countries specific to Asia.',
    newBadge: true,
  },
  {
    title: 'Europe',
    link: '/',
    image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
    description: 'Countries specific to Europe.',
    newBadge: true,
  },
  {
    title: 'Oceania',
    link: '/',
    image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
    description: 'Countries specific to Oceania.',
    newBadge: true,
  },
]

const countries: CardItem[] = [
  {
    title: 'Canada',
    link: '/',
    image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
    description: 'Provinces of Canada.',
    newBadge: true,
  },
  {
    title: 'Japan',
    link: '/',
    image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
    description: 'Prefectures of Japan.',
    newBadge: true,
  },
  {
    title: 'United States of America',
    link: '/',
    image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
    description: 'The 50 states of the USA.',
    newBadge: true,
  },
]

const socket = useSocket()

const connected = ref(false)
const response = ref([''])
const svgImage = ref('')
const disableButton = ref(false)
const answer1 = ref('')
const answer2 = ref('')
const answer3 = ref('')
const answer4 = ref('')
const score = ref(0)

onMounted(() => {
  socket.on('connect', () => {
    connected.value = socket.connected
  })
  socket.on('disconnect', () => {
    connected.value = socket.connected
  })
  socket.on('hello-response', (id: string, data: string, time: string) => {
    response.value.push(id + ' [' + time + ']: ' + data)
  })
  socket.on('dark', (data: boolean) => {
    useColorMode().preference = data ? 'dark' : 'light'
  })
  socket.on('question', ({ _, answers, image }) => {
    // response.value.push(question + ' [' + answers + ']')
    if (image) {
      svgImage.value = image
    }
    disableButton.value = false
    answer1.value = answers[0]
    answer2.value = answers[1]
    answer3.value = answers[2]
    answer4.value = answers[3]
  })
  socket.on('score', (_score: number) => {
    score.value = _score
  })
  socket.on('wrong-answer', (data: string) => {
    response.value.push('Wrong answer: ' + data)
  })
})

const username = ref('')
function setUsername() {
  if (username && username.value !== '') {
    socket.emit('new-username', username.value)
  }
  username.value = ''
}

function generateQuestion() {
  disableButton.value = true
  socket.emit('generate-question')
}

function generateClientQuestion() {
  disableButton.value = true
  createQuestions().then((q: Question) => {
    response.value.push(q.question + ' [' + q.answers + ']')
    if (q.image) {
      svgImage.value = q.image
    }
    disableButton.value = false
  })
}

function answerQuestion(answer: number) {
  let data
  if (answer === 1) {
    data = answer1.value
  } else if (answer === 2) {
    data = answer2.value
  } else if (answer === 3) {
    data = answer3.value
  } else if (answer === 4) {
    data = answer4.value
  }
  socket.emit('answer', data)
}
</script>

<template>
  <div>
    <p>Home page</p>
    <CardSlider :items="world" />
    <CardSlider :items="continents" />
    <CardSlider :items="countries" />
    <div>
      <ClientOnly>
        <h1>Color mode: {{ $colorMode.value }}</h1>
      </ClientOnly>
      <select v-model="$colorMode.preference">
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="sepia">Sepia</option>
      </select>
    </div>
    <div>Connected?: {{ connected }}</div>
    <button class="btn btn-success m-2" @click="socket.emit('hello', 'Hello World')">
      Hello World
    </button>
    <button
      class="btn btn-error m-2"
      @click="socket.emit('all-dark', useColorMode().preference !== 'dark')"
    >
      All Dark
    </button>
    <br />
    <input
      v-model="username"
      type="text"
      placeholder="Set new username"
      class="input input-bordered w-full max-w-xs"
    />
    <button class="btn btn-primary m-2" @click="setUsername()">Set username</button> <br />
    <button class="btn btn-warning m-2" :disabled="disableButton" @click="generateQuestion()">
      Generate Question
    </button>
    <button class="btn btn-warning m-2" :disabled="disableButton" @click="generateClientQuestion()">
      Generate Client-Side Question
    </button>
    <div v-if="svgImage">
      <img :src="svgImage" alt="SVG Image" width="100" />
    </div>
    <br />
    <div>
      <h2>Score: {{ score }}</h2>
    </div>
    <button
      v-if="answer1"
      class="btn btn-success m-1"
      :disabled="disableButton"
      @click="answerQuestion(1)"
    >
      {{ answer1 }}
    </button>
    <button
      v-if="answer2"
      class="btn btn-success m-1"
      :disabled="disableButton"
      @click="answerQuestion(2)"
    >
      {{ answer2 }}
    </button>
    <button
      v-if="answer3"
      class="btn btn-success m-1"
      :disabled="disableButton"
      @click="answerQuestion(3)"
    >
      {{ answer3 }}
    </button>
    <button
      v-if="answer4"
      class="btn btn-success m-1"
      :disabled="disableButton"
      @click="answerQuestion(4)"
    >
      {{ answer4 }}
    </button>
    <div>
      Response: <br />
      <div v-for="resp in response" :key="resp">{{ resp }}</div>
    </div>
  </div>
</template>
