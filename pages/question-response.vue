<script setup lang="ts">
const score = ref(12000)
const questionNumber = ref(1)
const maxQuestions = ref(10)
type ResponseState = 'waiting' | 'correct' | 'incorrect'

const singlePlayerStore = useSingleplayerStore()
const responseState = ref<ResponseState>('waiting')
const addedScore = ref(0)
const correctAnswer = ref('')

const router = useRouter()

if (singlePlayerStore.state !== 'not-started' && singlePlayerStore.state !== 'in-question') {
  responseState.value = singlePlayerStore.state
  score.value = singlePlayerStore.score
  questionNumber.value = singlePlayerStore.questionNumber
  correctAnswer.value =
    singlePlayerStore.questions[singlePlayerStore.questionNumber - 1].correctAnswer()
  maxQuestions.value = singlePlayerStore.maxQuestions
  addedScore.value = singlePlayerStore.addedScore

  singlePlayerStore.addedScore = 0

  singlePlayerStore.timer = setTimeout(() => {
    singlePlayerStore.state = 'in-question'
    singlePlayerStore.questionNumber += 1
    router.replace(`/question`)
  }, 3000)
}
</script>

<template>
  <div
    class="flex h-dvh flex-col justify-center"
    :class="[
      responseState === 'correct'
        ? 'bg-green-300'
        : responseState === 'incorrect'
          ? 'bg-red-400'
          : '',
    ]"
  >
    <div>
      <RoomTopNavigation
        :max-question-number="maxQuestions"
        :question-number="questionNumber"
        :score="score"
      />
    </div>
    <!-- User Waiting -->
    <div class="mb-24 flex flex-grow items-center justify-center">
      <div v-if="responseState === 'waiting'" class="flex text-4xl">
        <span>Waiting</span>
        <CSSLoader class="ml-1 mt-1" />
      </div>
      <!-- User Correct -->
      <UiHeadingOne v-else-if="responseState === 'correct'" class="text-center">
        Correct!
        <UiHeadingTwo class="mx-4 mt-2">+{{ addedScore }}</UiHeadingTwo>
      </UiHeadingOne>
      <!-- User Incorrect -->
      <div v-else-if="responseState === 'incorrect'" class="text-center">
        <UiHeadingOne>Incorrect</UiHeadingOne>
        <UiHeadingTwo v-if="correctAnswer" class="mx-4 mt-2">
          Correct answer: <b>{{ correctAnswer }}</b>
        </UiHeadingTwo>
      </div>
    </div>
  </div>
</template>
