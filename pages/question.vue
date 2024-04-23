<script setup lang="ts">
import { GenerativeQuiz, type Question } from '~/utils/utils'
import { createQuizzes } from '~/utils/countries'

const score = ref(12000)
const questionNumber = ref(1)
const maxQuestions = ref(10)
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

watch(multiplayerStore, () => {
  if (!multiplayerStore.multiPlayerQuestion) return
  questions.value = multiplayerStore.multiPlayerQuestion.answers ?? []
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

function setupSocketEvents() {
  if (socket.value === null) {
    return
  }

  socket.value?.on('user-info', (_username, _uuid, _roomCode, _roomHost, _score) => {
    multiplayerStore.uuid = _uuid
    multiplayerStore.host = _roomHost
    multiplayerStore.roomCode = _roomCode
    score.value = multiplayerStore.score = _score
  })

  socket.value?.on('room-player-update', (_, players) => {
    multiplayerStore.playerList = players
  })

  socket.value?.on('question', (_questionNumber, question, image) => {
    questionNumber.value = multiplayerStore.questionNumber = _questionNumber
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
    questions.value = answers
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

  socket.value?.on('room-left', () => {
    multiplayerStore.reset()
    router.replace('/')
  })

  questions.value = multiplayerStore.multiPlayerQuestion?.answers ?? []
}

watch(socket, () => {
  setupSocketEvents()
})

if (singlePlayer) {
  if (singlePlayerStore.state === 'generate-question') {
    singlePlayerSetup()
  } else {
    loadQuestions()
  }
} else {
  setupSocketEvents()
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
          v-if="
            singlePlayer
              ? singlePlayerQuestionList[questionNumber - 1]
              : multiplayerStore.multiPlayerQuestion
          "
          class="mx-3 mb-2 mt-4 text-center text-2xl font-semibold"
        >
          {{
            singlePlayer
              ? singlePlayerQuestionList[questionNumber - 1].question
              : multiplayerStore.multiPlayerQuestion?.question
          }}
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
                <span style="--value: 40"></span>
              </span>
            </div>
          </div>

          <!-- Submitted for larger screens -->
          <div
            v-if="!singlePlayer && multiplayerStore.multiPlayerQuestion"
            class="mx-8 flex items-center justify-center"
          >
            <h1 class="text-lg">
              Submitted {{ multiplayerStore.multiPlayerQuestion?.peopleAnswered?.length ?? 0 }}/{{
                multiplayerStore.playerList.length - 1
              }}
            </h1>
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
            class="btn btn-lg h-full bg-[#FCC93B] text-[#160f01] hover:bg-[#DCB133] focus:outline-[#DCB133] dark:bg-[#c99c00] dark:text-[#0f0900] dark:hover:bg-[#a98200] dark:focus:bg-[#a98200]"
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
