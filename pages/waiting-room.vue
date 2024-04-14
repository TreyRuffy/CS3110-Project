<script setup lang="ts">
const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
  event.preventDefault()
  event.returnValue = true
}

useEventListener('beforeunload', beforeUnloadHandler)

const roomCode = 'ABCD'

const roomUrl = useRequestURL().origin + '/join'

const host = true
const score = 12000
const questionNumber = 0
const maxQuestions = 10
</script>

<template>
  <div>
    <RoomTopNavigation
      :max-question-number="maxQuestions"
      :question-number="questionNumber"
      :score="score"
    />
    <h1 class="mb-2 mt-4 text-center text-2xl font-semibold">Waiting Room</h1>
    <h1 class="mb-2 mt-4 text-center text-2xl" :class="[host ? 'md:hidden' : '']">
      Room Code: <b>{{ roomCode }}</b>
    </h1>
    <div v-if="host">
      <h1 class="mb-2 ml-8 text-xl font-semibold">Players:</h1>
      <div class="grid h-[60vh] max-h-[60vh] md:h-[70vh] md:max-h-[70vh] md:grid-cols-3">
        <div class="md::overflow-y-auto ml-8 overflow-y-auto md:col-span-2">
          <PlayerList :players="['Mike', 'AJ', 'Ash', 'Peter', 'David', 'AmyJane']" />
        </div>
        <div class="hidden grid-flow-row items-center justify-center md:grid">
          <div class="mb-8">
            <RoomCode :room-code="roomCode" class="mx-auto w-[18vw]" />
            <h1 class="text-center text-lg">{{ roomUrl }}</h1>
            <h1 class="text-center text-lg">
              Room code: <b>{{ roomCode }}</b>
            </h1>
            <div class="mt-4 flex justify-center">
              <div class="btn btn-primary btn-wide">Start</div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-8 flex justify-center">
        <div class="btn btn-primary btn-lg btn-wide fixed bottom-8 md:hidden">Start</div>
      </div>
    </div>
    <div v-else>
      <h1 class="mb-2 mt-4 text-center text-2xl">Waiting for host to start the game...</h1>
    </div>
  </div>
</template>

<style scoped></style>
