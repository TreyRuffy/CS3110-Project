<script setup lang="ts">
const route = useRoute()
const { roomCode: roomCodeParam, username: usernameParam } = route.query
const roomCode = ref(roomCodeParam as string)
const username = ref(usernameParam as string)

const roomCodeInput = ref<HTMLInputElement | null>(null)
const usernameInput = ref<HTMLInputElement | null>(null)
const inputError = ref<string | null>(null)

const socketStore = useSocketStore()
const socket = computed({
  get: () => socketStore.socket,
  set: (value) => {
    socketStore.socket = value
  },
})

function joinRoom() {
  usernameInput.value?.classList.remove('input-error')
  roomCodeInput.value?.classList.remove('input-error')

  if (!roomCode.value || roomCode.value.length !== 4) {
    roomCodeInput.value?.classList.add('input-error')
    inputError.value = 'Please enter a room code'
  }

  if (!username.value || username.value.length < 2) {
    usernameInput.value?.classList.add('input-error')

    if (inputError.value) {
      inputError.value += ' and a username'
    } else {
      inputError.value = 'Please enter a username'
    }
  }

  if (!roomCode.value || !username.value) {
    return
  }

  socketStore.connect()
  socket.value?.emit('select-username', roomCode.value, username.value + '')
}

const router = useRouter()

watch(socket, () => {
  if (socket.value === null) {
    return
  }

  socket.value.on('username-error', (_, errorMessage) => {
    inputError.value = errorMessage
  })

  socket.value.on('username-accepted', (_username) => {
    username.value = _username
    socket.value?.emit('join-room', roomCode.value + '')
  })

  socket.value.on('room-joined', () => {
    router.push({
      path: '/waiting-room',
    })
  })

  socket.value.on('room-error', (_, errorMessage) => {
    inputError.value = errorMessage
  })

  socket.value.on('invalid-action', (message) => {
    inputError.value = message
  })

  socket.value?.on('user-info', (_username, _uuid, _roomCode, _roomHost, _score) => {
    if (_roomCode !== '') {
      router.push({
        path: '/waiting-room',
      })
    }
  })
})

if (socket.value !== null) {
  socket.value.emit('request-user-info')
}
</script>

<template>
  <div>
    <div class="min-h-dvh">
      <TopNavigation />
      <div class="mt-8 flex items-center">
        <div class="card mx-auto w-full max-w-2xl lg:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.25)]">
          <form class="px-10 py-10" method="dialog" @submit="joinRoom()">
            <h1 class="mb-4 text-center text-3xl font-semibold">Join Room</h1>
            <span ref="roomCodeInput" class="input input-bordered mt-6 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="h-5 w-5"
                role="img"
              >
                <path
                  fill-rule="evenodd"
                  d="M9.493 2.852a.75.75 0 0 0-1.486-.204L7.545 6H4.198a.75.75 0 0 0 0 1.5h3.14l-.69 5H3.302a.75.75 0 0 0 0 1.5h3.14l-.435 3.148a.75.75 0 0 0 1.486.204L7.955 14h2.986l-.434 3.148a.75.75 0 0 0 1.486.204L12.456 14h3.346a.75.75 0 0 0 0-1.5h-3.14l.69-5h3.346a.75.75 0 0 0 0-1.5h-3.14l.435-3.148a.75.75 0 0 0-1.486-.204L12.045 6H9.059l.434-3.148ZM8.852 7.5l-.69 5h2.986l.69-5H8.852Z"
                  clip-rule="evenodd"
                />
              </svg>

              <label for="room-code" class="hidden">Room code</label>
              <input
                id="room-code"
                v-model="roomCode"
                type="text"
                placeholder="Room code"
                class="grow"
                :maxlength="4"
                :required="true"
                aria-description="Room code entry field"
                oninput="this.value = this.value.replace(' ', '').toUpperCase()"
              />
            </span>

            <span ref="usernameInput" class="input input-bordered mt-2 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="h-5 w-5"
                role="img"
              >
                <path
                  d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z"
                />
              </svg>

              <label for="username" class="hidden">Username</label>
              <input
                id="username"
                v-model="username"
                type="text"
                placeholder="Username"
                class="grow"
                :maxlength="32"
                :required="true"
                aria-description="Username entry field"
                oninput="this.value = this.value.replace(' ', '')"
              />
            </span>
            <p v-if="inputError !== null" class="mt-4 justify-center text-center text-red-600">
              {{ inputError }}
            </p>
            <span class="flex justify-center" :class="inputError !== null ? 'mt-4' : 'mt-8'">
              <input type="submit" class="btn btn-primary w-full px-8 text-[16px]" value="Join" />
            </span>
          </form>
        </div>
      </div>
    </div>
    <TheFooter />
  </div>
</template>

<style scoped></style>
