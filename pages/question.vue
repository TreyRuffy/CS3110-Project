<script setup lang="ts">
import { GenerativeQuiz, type Question } from '~/utils/utils'
import { createQuizzes } from '~/utils/countries'

const score = ref(0)
const questionNumber = ref(0)
const maxQuestions = ref(0)
const singlePlayerQuestionList = ref<Question[]>([])

const questions = ref<string[]>([])

const singlePlayerStore = useSingleplayerStore()
const singlePlayer = singlePlayerStore.state !== 'not-started'

const multiplayerStore = useMultiplayerStore()

const socketStore = useSocketStore()
const socket = computed({
  get: () => socketStore.socket,
  set: (value) => {
    socketStore.socket = value
  },
})

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

function loadQuestions() {
  if (singlePlayer && singlePlayerStore.questions) {
    questionNumber.value = singlePlayerStore.questionNumber
    questions.value = singlePlayerStore.questions[questionNumber.value - 1].shuffledAnswers()
    singlePlayerQuestionList.value = singlePlayerStore.questions
    score.value = singlePlayerStore.score
    maxQuestions.value = singlePlayerStore.maxQuestions
  }
}

watch(singlePlayerStore.questions, () => {
  loadQuestions()
})

function loadMultiplayer() {
  if (!multiplayerStore.multiPlayerQuestion) return
  score.value = multiplayerStore.score
  questionNumber.value = multiplayerStore.questionNumber
  maxQuestions.value = multiplayerStore.maxQuestions
  questions.value = multiplayerStore.multiPlayerQuestion.answers ?? []
}

watch(multiplayerStore, () => {
  loadMultiplayer()
})

function answerQuestion(question?: string) {
  if (singlePlayer) {
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
  } else if (!multiplayerStore.host) {
    if (!socket.value) return
    if (!multiplayerStore.allowAnswers) return
    socket.value.emit('question-answer', question ?? '')
    router.replace(`/question-response`)
  }
}

const singlePlayerSetup = async () => {
  const quizzes = await createQuizzes()
  if (!quizzes) {
    return
  }
  const quiz = quizzes.find((quiz) => quiz && quiz.name === singlePlayerStore.region)?.quiz ?? null
  if (!quiz) {
    return
  }
  if (quiz instanceof GenerativeQuiz) {
    quiz.generateQuestions(singlePlayerStore.maxQuestions).then((_questions) => {
      singlePlayerStore.questions.push(..._questions)
    })
  } else {
    singlePlayerStore.questions.push(...quiz.questions)
    singlePlayerStore.maxQuestions = quiz.questions.length
  }
}

if (singlePlayer) {
  if (singlePlayerStore.state === 'generate-question') {
    singlePlayerSetup()
  } else {
    loadQuestions()
  }
} else {
  loadMultiplayer()
}
</script>

<template>
  <div class="flex h-dvh max-h-dvh w-full">
    <div class="custom-grid grid w-full items-center">
      <!-- Navbar -->
      <div>
        <RoomTopNavigation
          :host="multiplayerStore.host"
          :max-question-number="maxQuestions"
          :question-number="questionNumber"
          :score="score"
        />
      </div>
      <!-- Top content -->
      <div>
        <!-- Question and "End Question" button for larger screens -->
        <div class="custom-end-question-grid hidden w-full lg:grid">
          <div></div>
          <UiHeadingThree
            v-if="
              singlePlayer
                ? singlePlayerQuestionList[questionNumber - 1]
                : multiplayerStore.multiPlayerQuestion
            "
            class="mx-3 mb-2 mt-4 text-center font-semibold"
          >
            {{
              singlePlayer
                ? singlePlayerQuestionList[questionNumber - 1].question
                : multiplayerStore.multiPlayerQuestion?.question
            }}
          </UiHeadingThree>
          <UiHeadingThree v-else class="mx-3 mb-2 mt-4 text-center font-semibold"
            >Loading...
          </UiHeadingThree>
          <div
            v-if="!singlePlayer && multiplayerStore.host && multiplayerStore.multiPlayerQuestion"
            class="flex justify-end"
          >
            <UiButtonTopRight class="mt-4">End Question</UiButtonTopRight>
          </div>
        </div>
        <!-- Question for smaller screens -->
        <div class="lg:hidden">
          <UiHeadingThree
            v-if="
              singlePlayer
                ? singlePlayerQuestionList[questionNumber - 1]
                : multiplayerStore.multiPlayerQuestion
            "
            class="mx-3 mb-2 mt-4 text-center font-semibold"
          >
            {{
              singlePlayer
                ? singlePlayerQuestionList[questionNumber - 1].question
                : multiplayerStore.multiPlayerQuestion?.question
            }}
          </UiHeadingThree>
          <UiHeadingThree v-else class="mx-3 mb-2 mt-4 text-center font-semibold"
            >Loading...
          </UiHeadingThree>
        </div>
      </div>
      <div class="flex justify-center">
        <div class="grid w-fit lg:grid-cols-3">
          <div class="flex items-center justify-center">
            <!-- Timer for bigger screens -->
            <div
              class="hidden h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg lg:flex lg:h-24 lg:w-24"
            >
              <span class="countdown absolute flex font-mono text-2xl lg:text-4xl">
                <span
                  v-if="multiplayerStore.timer !== 0"
                  :style="'--value: ' + multiplayerStore.timer"
                ></span>
              </span>
            </div>
          </div>
          <div class="relative mx-8 flex justify-center">
            <NuxtImg
              v-if="
                singlePlayer
                  ? singlePlayerQuestionList[questionNumber - 1]
                  : multiplayerStore.multiPlayerQuestion
              "
              :src="
                singlePlayer
                  ? singlePlayerQuestionList[questionNumber - 1].image
                  : multiplayerStore.multiPlayerQuestion?.image
              "
              class="image-to-guess shadow-[0_20px_50px_-10px_rgba(0,0,0,0.25)]"
              format="webp"
              alt="Image to guess from"
              :draggable="false"
            />
            <!-- Timer for smaller screens -->
            <div
              class="absolute start-[-25px] top-[35%] flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg lg:hidden"
            >
              <span class="countdown flex font-mono text-2xl md:text-4xl">
                <span
                  v-if="multiplayerStore.timer !== 0"
                  :style="'--value: ' + multiplayerStore.timer"
                ></span>
              </span>
            </div>
          </div>

          <!-- Submitted for all screens -->
          <div
            v-if="!singlePlayer && multiplayerStore.host && multiplayerStore.multiPlayerQuestion"
            class="mx-8 flex items-center justify-center"
          >
            <!-- End Question Button on smaller screens -->
            <UiButtonRegular class="btn-primary m-2 lg:hidden">End Question</UiButtonRegular>
            <UiHeadingFive>
              Submitted {{ multiplayerStore.multiPlayerQuestion?.peopleAnswered?.length ?? 0 }}/{{
                multiplayerStore.playerList.length - 1
              }}
            </UiHeadingFive>
          </div>
        </div>
      </div>
      <!-- Bottom content -->
      <div class="h-full">
        <div class="mx-2 grid h-full grid-cols-2 grid-rows-2 gap-2">
          <UiButtonQuiz
            class="btn-primary"
            :disabled="singlePlayer || multiplayerStore.allowAnswers"
            @click="answerQuestion(questions[0])"
          >
            {{ questions[0] }}
          </UiButtonQuiz>
          <UiButtonQuiz
            class="btn-secondary"
            :disabled="singlePlayer || multiplayerStore.allowAnswers"
            @click="answerQuestion(questions[1])"
          >
            {{ questions[1] }}
          </UiButtonQuiz>
          <UiButtonQuiz
            class="btn-accent"
            :disabled="singlePlayer || multiplayerStore.allowAnswers"
            @click="answerQuestion(questions[2])"
          >
            {{ questions[2] }}
          </UiButtonQuiz>
          <UiButtonQuiz
            class="bg-[#FCC93B] text-[#160f01] hover:bg-[#DCB133] focus:outline-[#DCB133] dark:bg-[#c99c00] dark:text-[#0f0900] dark:hover:bg-[#a98200] dark:focus:bg-[#a98200]"
            :disabled="singlePlayer || multiplayerStore.allowAnswers"
            @click="answerQuestion(questions[3])"
          >
            {{ questions[3] }}
          </UiButtonQuiz>
        </div>
      </div>
      <!-- Added space -->
      <div></div>
    </div>
  </div>
</template>

<style scoped>
/* Custom grid for the entire page */
.custom-grid {
  grid-template-rows: 64px auto 1fr 1fr 10px;
}

/* Custom grid for 'End Question Button' */
.custom-end-question-grid {
  grid-template-columns: 1fr 3fr 1fr;
}

.image-to-guess {
  max-width: 350px;
  max-height: 200px;
  min-width: 250px;
  min-height: 150px;
}

/* Devices such as iPhone 12 Pro, iPhone SE, Samsung Galaxy S8+, Galaxy Z Fold 5, iPhone X, */
@media (max-width: 450px) and (max-height: 1000px) {
  .image-to-guess {
    max-height: 280px;
    max-width: 280px;
  }
}
/* Devices such as iPhone 5, iPhone SE */
@media (max-width: 392px) and (max-height: 668px) {
  .image-to-guess {
    max-height: 150px;
    max-width: 250px;
  }
}
/* Devices such as Surface Pro 7, iPad Mini, iPad Pro, iPad Air */
@media (min-width: 760px) and (max-width: 1025px) and (min-height: 1000px) {
  .image-to-guess {
    max-height: 350px;
    max-width: 600px;
    min-width: 400px;
  }
}
</style>
