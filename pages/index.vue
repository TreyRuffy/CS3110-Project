<script setup lang="ts">
import { register } from 'swiper/element/bundle'
import { createQuizzes } from '~/utils/countries'

register()

definePageMeta({
  title: 'Home',
  description: 'Home Page - CS3110 Project',
})

const connected = ref(false)
const response = ref([''])
const svgImage = ref('')
const disableButton = ref(false)
const question = ref('')
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
})

function generateClientQuestion() {
  disableButton.value = true
  createQuizzes().then(() => {
    const quiz = getQuiz('test2')
    if (!quiz) {
      return
    }
    if (!(quiz instanceof GenerativeQuiz)) {
      const q = quiz.questions[0]
      if (q.image) {
        svgImage.value = q.image
      }
      disableButton.value = false
      question.value = q.question
      answerList.value = q.shuffledAnswers()
      correctClientAnswer = q.correctAnswer()
      return
    }
    quiz.generateQuestions(1).then((questions) => {
      const q = questions[0]
      if (q.image) {
        svgImage.value = q.image
      }
      disableButton.value = false
      question.value = q.question
      answerList.value = q.shuffledAnswers()
      correctClientAnswer = q.correctAnswer()
    })
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
    // socket.value.emit('answer', answerList.value[answer - 1])
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
    <NuxtLink href="/waiting-room" class="btn btn-primary m-2"> Waiting Room </NuxtLink>
    <br />
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
      <p>{{ question }}</p>
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
