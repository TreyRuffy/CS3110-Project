<script setup lang="ts">
const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
  event.preventDefault()
  event.returnValue = true
}

useEventListener('beforeunload', beforeUnloadHandler)

const route = useRoute()

const socketStore = useSocketStore()
const socket = computed({
  get: () => socketStore.socket,
  set: (value) => {
    socketStore.socket = value
  },
})

const roomCode = route.query.roomCode as string
const roomUrl = useRequestURL().origin + '/join'

const host = route.query.host
const score = 12000
const questionNumber = 0
const maxQuestions = 10

watch(socket, () => {
  if (socket.value === null) {
    return
  }

  socket.value.on('successful-connection', () => {
    console.log('successful-connection')
  })

  socket.value?.on('game-starting', (timer) => {
    console.log('game-starting', timer)
  })
})

socketStore.connect()
</script>

<template>
  <div class="flex h-screen flex-col">
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
              <button
                class="btn btn-primary btn-wide"
                @click="
                  () => {
                    if (socket) {
                      socket.emit('host-start-game')
                    } else {
                      console.log('Socket not connected')
                    }
                  }
                "
              >
                Start
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-8 flex justify-center">
        <div
          class="btn btn-primary btn-lg btn-wide fixed bottom-8 shadow-md md:hidden"
          @click="
            () => {
              if (socket) {
                socket.emit('host-start-game')
              } else {
                console.log('Socket not connected')
              }
            }
          "
        >
          Start
        </div>
      </div>
    </div>
    <div v-else>
      <div class="mx-4 mt-44">
        <!-- Waiting for host... on small + screens -->
        <div class="hidden items-center justify-center text-center text-4xl sm:flex">
          <span>Waiting for host to start the game</span>
          <CSSLoader class="ml-1 mt-1" />
        </div>
        <!-- Waiting for host... on very small screens -->
        <div class="items-center justify-center text-center text-4xl sm:hidden">
          <div>Waiting for host to</div>
          <div class="flex justify-center">
            <span>start the game</span><CSSLoader class="ml-1 mt-1" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
