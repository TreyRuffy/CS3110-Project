<script setup lang="ts">
import xss from 'xss'

const singlePlayerStore = useSingleplayerStore()
singlePlayerStore.reset()

const multiplayerStore = useMultiplayerStore()
multiplayerStore.reset()

const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
  event.preventDefault()
  event.returnValue = true
}

useEventListener('beforeunload', beforeUnloadHandler)

const socketStore = useSocketStore()
const socket = computed({
  get: () => socketStore.socket,
  set: (value) => {
    socketStore.socket = value
  },
})

const roomUrl = useRequestURL().origin + '/join'

const router = useRouter()
if (socket.value === null) {
  router.replace('/')
} else {
  socket.value?.emit('request-user-info')
}

function getPlayerList() {
  const list = []
  for (const player of multiplayerStore.playerList) {
    if (player[0] !== multiplayerStore.uuid) {
      list.push(player[1])
    }
  }
  return list
}

const hostname = useRequestURL().origin
</script>

<template>
  <div class="flex h-dvh flex-col">
    <RoomTopNavigation
      :max-question-number="multiplayerStore.maxQuestions"
      :question-number="multiplayerStore.questionNumber"
      :score="multiplayerStore.score"
    />
    <UiTitle title="Waiting Room" />
    <button
      class="mb-2 mt-4 text-center text-2xl"
      :class="[multiplayerStore.host ? 'md:hidden' : '']"
      @click="copyRoomCode(hostname, xss(multiplayerStore.roomCode))"
    >
      Room Code: <b>{{ multiplayerStore.roomCode }}</b>
    </button>
    <div v-if="multiplayerStore.host">
      <h1 class="mb-2 text-center text-xl font-semibold md:ml-8 md:text-left">Players:</h1>
      <div class="grid h-[60vh] max-h-[60vh] md:h-[70vh] md:max-h-[70vh] md:grid-cols-3">
        <div class="ml-8 overflow-y-auto md:col-span-2 md:overflow-y-auto">
          <PlayerList :players="getPlayerList()" />
        </div>
        <div class="hidden grid-flow-row items-center justify-center md:grid">
          <div class="mb-8">
            <RoomCode :room-code="multiplayerStore.roomCode" class="mx-auto w-[18vw]" />
            <h1 class="text-center text-lg">{{ roomUrl }}</h1>
            <div
              class="text-center text-lg"
              @click="copyRoomCode(hostname, xss(multiplayerStore.roomCode))"
            >
              <button>
                Room code: <b>{{ multiplayerStore.roomCode }}</b>
              </button>
            </div>
            <div class="mt-4 flex justify-center">
              <UiButton
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
              </UiButton>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-8 flex justify-center md:hidden">
        <UiButton
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
        </UiButton>
      </div>
    </div>
    <div v-else class="flex h-1/2 items-center justify-center">
      <div class="mx-4">
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
