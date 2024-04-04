<script setup lang="ts">
const route = useRoute()
const { roomCode: roomCodeParam, username: usernameParam } = route.query
const roomCode = ref(roomCodeParam)
const username = ref(usernameParam)

const roomCodeInput = ref<HTMLInputElement | null>(null)
const usernameInput = ref<HTMLInputElement | null>(null)
const inputError = ref<string | null>(null)

const connected = ref(false)
const response = ref([''])

const chatMessage = ref('')

const socketStore = useSocketStore()
const socket = computed({
  get: () => socketStore.socket,
  set: (value) => {
    socketStore.socket = value
  },
})

function joinRoom() {
  inputError.value = null
  if (!roomCode.value) {
    roomCodeInput.value?.classList.add('input-error')
    inputError.value = 'Please enter a room code'
  }
  if (!username.value) {
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
  socket.value?.emit('select-username', username.value + '')
  socket.value?.emit('join-room', roomCode.value + '')

  roomCode.value = null
  username.value = null
  usernameInput.value?.classList.remove('input-error')
  roomCodeInput.value?.classList.remove('input-error')
}

watch(socket, () => {
  if (socket.value === null) {
    return
  }
  socket.value.on('connect', () => {
    connected.value = socket.value === null || socket.value.connected
  })
  socket.value.on('disconnect', () => {
    connected.value = socket.value === null || socket.value.connected
  })
  socket.value.on('successful-connection', (data) => {
    response.value.push(data)
  })
  socket.value.on('username-error', (errorType, errorMessage) => {
    response.value.push(errorType + ': ' + errorMessage)
  })
  socket.value.on('username-accepted', (username) => {
    response.value.push(username)
  })
  socket.value.on('room-joined', (roomCode) => {
    response.value.push(roomCode)
  })
  socket.value.on('room-created', (roomCode) => {
    response.value.push(roomCode)
  })
  socket.value.on('room-error', (errorType, errorMessage) => {
    response.value.push(errorType + ': ' + errorMessage)
  })
  socket.value.on('receive-chat-message', (username, message) => {
    response.value.push(username + ': ' + message)
  })
})
</script>

<template>
  <div class="mt-4">
    <div class="flex items-center">
      <div class="card mx-auto w-full max-w-2xl lg:shadow-xl">
        <form class="px-10 py-10" method="dialog" @submit="joinRoom()">
          <h2 class="mb-4 text-center text-2xl font-semibold">Join Room</h2>
          <label
            ref="roomCodeInput"
            for="room-code"
            class="input input-bordered mt-6 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="h-5 w-5"
            >
              <path
                fill-rule="evenodd"
                d="M9.493 2.852a.75.75 0 0 0-1.486-.204L7.545 6H4.198a.75.75 0 0 0 0 1.5h3.14l-.69 5H3.302a.75.75 0 0 0 0 1.5h3.14l-.435 3.148a.75.75 0 0 0 1.486.204L7.955 14h2.986l-.434 3.148a.75.75 0 0 0 1.486.204L12.456 14h3.346a.75.75 0 0 0 0-1.5h-3.14l.69-5h3.346a.75.75 0 0 0 0-1.5h-3.14l.435-3.148a.75.75 0 0 0-1.486-.204L12.045 6H9.059l.434-3.148ZM8.852 7.5l-.69 5h2.986l.69-5H8.852Z"
                clip-rule="evenodd"
              />
            </svg>

            <input
              id="room-code"
              v-model="roomCode"
              type="text"
              placeholder="Room code"
              class="grow"
              :maxlength="6"
              oninput="this.value = this.value.toUpperCase()"
            />
          </label>

          <label
            ref="usernameInput"
            for="username"
            class="input input-bordered mt-2 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="h-5 w-5"
            >
              <path
                d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z"
              />
            </svg>

            <input
              id="username"
              v-model="username"
              type="text"
              placeholder="Username"
              class="grow"
              :maxlength="32"
            />
          </label>
          <p v-if="inputError !== null" class="mt-4 justify-center text-center text-red-600">
            {{ inputError }}
          </p>
          <span class="flex justify-center" :class="inputError !== null ? 'mt-4' : 'mt-8'">
            <input type="submit" class="btn btn-primary w-full px-8" value="Join" />
          </span>
        </form>
      </div>
    </div>
    <div>
      <ClientOnly>
        <span> Connected?: {{ connected }} </span>
      </ClientOnly>
      <button v-if="!connected" class="btn btn-primary m-2" @click="socketStore.connect()">
        Connect
      </button>
      <br />
      <button
        v-if="connected"
        class="btn btn-primary m-2"
        @click="socket && socket.emit('create-room')"
      >
        Create Room
      </button>
      <br />
      <input
        v-if="connected"
        v-model="chatMessage"
        type="text"
        placeholder="Send a chat message"
        class="input input-bordered w-full max-w-xs"
      />
      <button
        v-if="connected"
        class="btn btn-primary m-2"
        @click="socket && socket.emit('send-chat-message', chatMessage)"
      >
        Send Message
      </button>
      <div>
        Response: <br />
        <div v-for="resp in response" :key="resp">{{ resp }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
