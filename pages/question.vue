<script setup lang="ts">
import { GenerativeQuiz, type Question } from '~/utils/utils'
import { createQuizzes } from '~/utils/countries'

const score = ref(12000)
const questionNumber = ref(1)
const maxQuestions = ref(10)
const questionList = ref<Question[]>([])
const questions = ref<string[]>([])

const singlePlayerStore = useSingleplayerStore()
const singlePlayer = singlePlayerStore.state !== 'not-started'

const socketStore = useSocketStore()
const router = useRouter()
const toastStore = useToastStore()

if (!singlePlayer && socketStore.socket === null) {
  toastStore.addToast({
    title: 'Error',
    message: 'You are not connected to a room.',
    type: 'error',
  })
  router.replace('/')
}

watch(singlePlayerStore.questions, () => {
  if (singlePlayer && singlePlayerStore.questions) {
    questionNumber.value = singlePlayerStore.questionNumber
    questions.value = singlePlayerStore.questions[questionNumber.value - 1].shuffledAnswers()
    questionList.value = singlePlayerStore.questions
    score.value = singlePlayerStore.score
    maxQuestions.value = singlePlayerStore.maxQuestions
  }
})

function answerQuestion(question?: string) {
  if (singlePlayerStore.state !== 'not-started') {
    // Check answer
    if (!singlePlayerStore.questions) return
    if (!question) {
      singlePlayerStore.state = 'incorrect'
      router.replace(`/question-response`)
      return
    }
    if (question === singlePlayerStore.questions[questionNumber.value - 1].correctAnswer()) {
      singlePlayerStore.score += 1000
      singlePlayerStore.addedScore = 1000
      singlePlayerStore.state = 'correct'
      router.replace(`/question-response`)
    } else {
      singlePlayerStore.state = 'incorrect'
      router.replace(`/question-response`)
    }
  } else {
    // Send answer to server
  }
}

const singlePlayerSetup = async () => {
  const quizzes = await createQuizzes()
  if (!quizzes) {
    return
  }
  const singlePlayerStore = useSingleplayerStore()
  const quiz = quizzes.find((quiz) => quiz && quiz.name === singlePlayerStore.region)?.quiz ?? null
  if (!quiz) {
    return
  }
  if (quiz instanceof GenerativeQuiz) {
    quiz.generateQuestions(1).then((_questions) => {
      singlePlayerStore.questions.push(..._questions)
    })
  } else {
    singlePlayerStore.questions.push(...quiz.questions)
  }
}

if (singlePlayer) {
  singlePlayerSetup()
}
</script>

<template>
  <div class="flex h-dvh w-full">
    <div class="custom-grid grid w-full items-center">
      <!-- Navbar -->
      <div>
        <RoomTopNavigation
          :max-question-number="maxQuestions"
          :question-number="questionNumber"
          :score="score"
        />
      </div>
      <!-- Top content -->
      <div>
        <h1
          v-if="questionList[questionNumber - 1]"
          class="mx-3 mb-2 mt-4 text-center text-2xl font-semibold"
        >
          {{ questionList[questionNumber - 1].question }}
        </h1>
        <h1 v-else class="mx-3 mb-2 mt-4 text-center text-2xl font-semibold">Loading...</h1>
      </div>
      <div class="flex justify-center">
        <div class="grid w-fit lg:grid-cols-3">
          <div class="flex items-center justify-center">
            <!-- Timer for bigger screens -->
            <div
              class="hidden h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg lg:flex lg:h-24 lg:w-24"
            >
              <span class="countdown absolute flex font-mono text-2xl lg:text-4xl">
                <span style="--value: 41"></span>
              </span>
            </div>
          </div>
          <div class="relative mx-8 flex justify-center">
            <NuxtImg
              v-if="questionList[questionNumber - 1]"
              :src="questionList[questionNumber - 1].image"
              class="border-2 border-gray-950"
              format="webp"
              :height="42"
              alt="United States"
              :draggable="false"
            />
            <!-- Timer for smaller screens -->
            <div
              class="absolute start-[-25px] top-[35%] flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg lg:hidden"
            >
              <span class="countdown flex font-mono text-2xl md:text-4xl">
                <span style="--value: 40"></span>
              </span>
            </div>
          </div>

          <!-- Submitted for larger screens -->
          <div v-if="!singlePlayer" class="mx-8 flex items-center justify-center">
            <h1 class="text-lg">Submitted 11/20</h1>
          </div>
        </div>
      </div>
      <!-- Bottom content -->
      <div class="h-full">
        <div class="mx-2 grid h-full grid-cols-2 grid-rows-2 gap-2">
          <button class="btn btn-primary btn-lg h-full" @click="answerQuestion(questions[0])">
            {{ questions[0] }}
          </button>
          <button class="btn btn-secondary btn-lg h-full" @click="answerQuestion(questions[1])">
            {{ questions[1] }}
          </button>
          <button class="btn btn-accent btn-lg h-full" @click="answerQuestion(questions[2])">
            {{ questions[2] }}
          </button>
          <button
            class="btn btn-lg h-full bg-[#FCC93B] hover:bg-[#DCB133] focus:outline-[#DCB133]"
            @click="answerQuestion(questions[3])"
          >
            {{ questions[3] }}
          </button>
        </div>
      </div>
      <!-- Added space -->
      <div></div>
    </div>
  </div>
</template>

<style scoped>
.custom-grid {
  grid-template-rows: 64px auto 1fr 1fr 10px;
}
</style>
