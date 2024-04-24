<script setup lang="ts">
const multiplayerStore = useMultiplayerStore()

const router = useRouter()
if (multiplayerStore.state === 'not-started') {
  router.replace('/')
}

const socketStore = useSocketStore()
const socket = computed({
  get: () => socketStore.socket,
  set: (value) => {
    socketStore.socket = value
  },
})

function getCount(answer: string) {
  if (
    multiplayerStore.multiPlayerQuestion?.answers &&
    multiplayerStore.multiPlayerQuestion?.answerCount
  ) {
    const index = multiplayerStore.multiPlayerQuestion.answerCount.findIndex(
      (item) => item.answer === answer,
    )
    return multiplayerStore.multiPlayerQuestion.answerCount[index].count
  }
  return 0
}

multiplayerStore.resetTimer()
</script>

<template>
  <div class="flex h-dvh max-h-dvh flex-col">
    <div class="mb-4">
      <RoomTopNavigation
        :host="multiplayerStore.host"
        :max-question-number="multiplayerStore.maxQuestions"
        :question-number="multiplayerStore.questionNumber"
        :score="multiplayerStore.score"
      />
    </div>
    <!-- Next Question Button Large Screens -->
    <div class="hidden text-right md:block">
      <UiButtonTopRight
        @click="
          () => {
            if (socket) {
              socket.emit('question-next')
            } else {
              console.log('Socket not connected')
            }
          }
        "
        >Next Question</UiButtonTopRight
      >
    </div>
    <div class="mb-32 flex flex-grow flex-col justify-center">
      <!-- Correct Answer-->
      <div class="justify-center">
        <UiHeadingTwo class="mb-2 text-center font-[500]">
          Correct answer: {{ multiplayerStore.correctAnswer }}
        </UiHeadingTwo>
        <!-- Aligning the 3 cards in the middle of the page -->
        <div class="mx-3 grid md:mx-0 md:grid-cols-3">
          <!-- Empty div -->
          <div></div>
          <!-- Creating 4 different cards in a row -->
          <div
            v-if="
              multiplayerStore.multiPlayerQuestion?.answers &&
              multiplayerStore.multiPlayerQuestion?.answerCount
            "
            class="grid gap-2"
          >
            <div class="card w-auto bg-primary shadow-md">
              <QuestionAnswerCard
                :num-answers="getCount(multiplayerStore.multiPlayerQuestion?.answers[0])"
                :country-choice="multiplayerStore.multiPlayerQuestion?.answers[0]"
              />
            </div>
            <div class="card w-auto bg-secondary shadow-md">
              <QuestionAnswerCard
                :num-answers="getCount(multiplayerStore.multiPlayerQuestion?.answers[1])"
                :country-choice="multiplayerStore.multiPlayerQuestion?.answers[1]"
              />
            </div>
            <div class="card w-auto bg-accent shadow-md">
              <QuestionAnswerCard
                :num-answers="getCount(multiplayerStore.multiPlayerQuestion?.answers[2])"
                :country-choice="multiplayerStore.multiPlayerQuestion?.answers[2]"
              />
            </div>
            <div class="card w-auto bg-[#FCC93B] shadow-md">
              <QuestionAnswerCard
                :num-answers="getCount(multiplayerStore.multiPlayerQuestion?.answers[3])"
                :country-choice="multiplayerStore.multiPlayerQuestion?.answers[3]"
              />
            </div>
          </div>
          <!-- Empty div -->
          <div></div>
          <!-- Next Question Button Smaller Screens -->
          <div class="mt-8 flex justify-center">
            <UiButtonBottom
              class="fixed"
              @click="
                () => {
                  if (socket) {
                    socket.emit('question-next')
                  } else {
                    console.log('Socket not connected')
                  }
                }
              "
            >
              Next Question
            </UiButtonBottom>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
