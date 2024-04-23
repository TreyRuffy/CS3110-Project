<script setup lang="ts">
const multiPlayerStore = useMultiplayerStore()

const router = useRouter()
if (multiPlayerStore.state === 'not-started') {
  router.replace('/')
}

const socketStore = useSocketStore()
const socket = computed({
  get: () => socketStore.socket,
  set: (value) => {
    socketStore.socket = value
  },
})
</script>

<template>
  <div class="flex h-dvh flex-col">
    <div class="mb-4">
      <RoomTopNavigation
        :max-question-number="multiPlayerStore.maxQuestions"
        :question-number="multiPlayerStore.questionNumber"
        :score="multiPlayerStore.score"
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
        <h1 class="mb-2 text-center text-2xl font-semibold">
          Correct answer: {{ multiPlayerStore.correctAnswer }}
        </h1>
        <!-- Aligning the 3 cards in the middle of the page -->
        <div class="mx-3 grid md:mx-0 md:grid-cols-3">
          <!-- Empty div -->
          <div></div>
          <!-- Creating 4 different cards in a row -->
          <div
            v-if="
              multiPlayerStore.multiPlayerQuestion?.answers &&
              multiPlayerStore.multiPlayerQuestion?.answerCount
            "
            class="grid gap-2"
          >
            <div class="card w-auto bg-primary shadow-md">
              <QuestionAnswerCard
                :num-answers="multiPlayerStore.multiPlayerQuestion?.answerCount[0].count"
                :country-choice="multiPlayerStore.multiPlayerQuestion?.answers[0]"
              />
            </div>
            <div class="card w-auto bg-secondary shadow-md">
              <QuestionAnswerCard
                :num-answers="multiPlayerStore.multiPlayerQuestion?.answerCount[1].count"
                :country-choice="multiPlayerStore.multiPlayerQuestion?.answers[1]"
              />
            </div>
            <div class="card w-auto bg-accent shadow-md">
              <QuestionAnswerCard
                :num-answers="multiPlayerStore.multiPlayerQuestion?.answerCount[2].count"
                :country-choice="multiPlayerStore.multiPlayerQuestion?.answers[2]"
              />
            </div>
            <div class="card w-auto bg-[#FCC93B] shadow-md">
              <QuestionAnswerCard
                :num-answers="multiPlayerStore.multiPlayerQuestion?.answerCount[3].count"
                :country-choice="multiPlayerStore.multiPlayerQuestion?.answers[3]"
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
