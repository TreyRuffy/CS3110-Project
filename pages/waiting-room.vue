<script setup lang="ts">
import type { UUID } from '~/utils/socket-types'

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

const roomCode = ref('')
const roomUrl = useRequestURL().origin + '/join'

type Player = [uuid: UUID, username: string]

const playerList = ref<Player[]>([])

let uuid = ''
const host = ref(false)
const score = ref(12000)
const questionNumber = ref(0)
const maxQuestions = ref(10)

function setupSocketEvents() {
  if (socket.value === null) {
    return
  }

  socket.value.on('successful-connection', () => {
    console.log('successful-connection')
  })

  socket.value?.on('game-starting', (timer) => {
    console.log('game-starting', timer)
  })

  socket.value?.on('user-info', (_username, _uuid, _roomCode, _roomHost, _score) => {
    uuid = _uuid
    host.value = _roomHost
    roomCode.value = _roomCode
    score.value = _score
  })

  socket.value?.on('room-player-update', (_, players) => {
    playerList.value = players
  })

  socket.value?.on('room-left', () => {
    router.push('/')
  })
}

watch(socket, () => {
  setupSocketEvents()
})

const router = useRouter()
if (socket.value === null) {
  router.replace('/')
} else {
  setupSocketEvents()
  socket.value?.emit('request-user-info')
}

function getPlayerList() {
  const list = []
  for (const player of playerList.value) {
    if (player[0] !== uuid) {
      list.push(player[1])
    }
  }
  return list
}
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
          <PlayerList :players="getPlayerList()" />
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
