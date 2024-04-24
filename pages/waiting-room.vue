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
  <div class="flex h-dvh max-h-dvh flex-col">
    <RoomTopNavigation
      :max-question-number="multiplayerStore.maxQuestions"
      :question-number="multiplayerStore.questionNumber"
      :score="multiplayerStore.score"
    />
    <UiHeadingOne>Waiting Room</UiHeadingOne>
    <button
      class="mb-2 mt-4 text-center"
      :class="[multiplayerStore.host ? 'md:hidden' : '']"
      @click="copyRoomCode(hostname, xss(multiplayerStore.roomCode))"
    >
      <UiHeadingThree>
        Room Code: <b>{{ multiplayerStore.roomCode }}</b>
      </UiHeadingThree>
    </button>
    <div v-if="multiplayerStore.host">
      <UiHeadingThree class="mb-2 text-center font-[500] md:ml-8 md:text-left">
        Players:
      </UiHeadingThree>
      <div class="grid h-[60vh] max-h-[60vh] md:h-[70vh] md:max-h-[70vh] md:grid-cols-3">
        <div class="ml-8 overflow-y-auto md:col-span-2 md:overflow-y-auto">
          <PlayerList :players="getPlayerList()" />
        </div>
        <div class="hidden grid-flow-row items-center justify-center md:grid">
          <div class="mb-8">
            <RoomCode :room-code="multiplayerStore.roomCode" class="mx-auto w-[18vw]" />
            <UiHeadingFour class="text-center">{{ roomUrl }}</UiHeadingFour>
            <div
              class="text-center"
              @click="copyRoomCode(hostname, xss(multiplayerStore.roomCode))"
            >
              <button>
                <UiHeadingFour>
                  Room code: <b>{{ multiplayerStore.roomCode }}</b>
                </UiHeadingFour>
              </button>
            </div>
            <!-- Start button larger screens -->
            <div class="mt-4 flex justify-center">
              <UiButtonRegular
                class="btn-primary btn-wide"
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
              </UiButtonRegular>
            </div>
          </div>
        </div>
      </div>
      <!-- Start Button Smaller Screens -->
      <div class="mt-8 flex justify-center md:hidden">
        <UiButtonBottom
          class="fixed"
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
        </UiButtonBottom>
      </div>
    </div>
    <div v-else class="flex h-1/2 items-center justify-center">
      <div class="mx-4">
        <!-- Waiting for host... on small -> largest screens -->
        <UiHeadingOne class="hidden items-center justify-center text-center sm:flex">
          <span>Waiting for host to start the game</span>
          <CSSLoader class="ml-1 mt-1" />
        </UiHeadingOne>
        <!-- Waiting for host... on very small screens -->
        <UiHeadingOne class="items-center justify-center text-center sm:hidden">
          <div>Waiting for host to</div>
          <div class="flex justify-center">
            <span>start the game</span><CSSLoader class="ml-1 mt-1" />
          </div>
        </UiHeadingOne>
      </div>
    </div>
  </div>
</template>
