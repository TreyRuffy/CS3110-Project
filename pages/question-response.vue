<script setup lang="ts">
const score = ref(12000)
const questionNumber = ref(1)
const maxQuestions = ref(10)
type ResponseState = 'waiting' | 'correct' | 'incorrect'

const singlePlayerStore = useSingleplayerStore()
const responseState = ref<ResponseState>('waiting')
const addedScore = ref(0)

const router = useRouter()

if (singlePlayerStore.state !== 'not-started' && singlePlayerStore.state !== 'in-question') {
  responseState.value = singlePlayerStore.state
  score.value = singlePlayerStore.score
  questionNumber.value = singlePlayerStore.questionNumber
  maxQuestions.value = singlePlayerStore.maxQuestions
  addedScore.value = singlePlayerStore.addedScore

  singlePlayerStore.addedScore = 0

  setTimeout(() => {
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
    <div class="mb-24 flex flex-grow items-center justify-center">
      <div v-if="responseState === 'waiting'" class="flex text-4xl">
        <span> Waiting</span>
        <CSSLoader class="ml-1 mt-1" />
      </div>
      <div v-else-if="responseState === 'correct'" class="text-center text-4xl">
        Correct!
        <div>+{{ addedScore }}</div>
      </div>
      <div v-else-if="responseState === 'incorrect'" class="text-4xl">Incorrect</div>
    </div>
  </div>
</template>
