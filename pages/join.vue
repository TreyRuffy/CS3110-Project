<script setup lang="ts">
const route = useRoute()
const { roomCode: roomCodeParam, username: usernameParam } = route.query
const roomCode = ref(roomCodeParam)
const username = ref(usernameParam)

function joinRoom() {
  if (!roomCode.value) {
    alert('Please enter a room code')
    return
  }
  if (!username.value) {
    alert('Please enter a username')
    return
  }
  console.log('Room code: ' + roomCode.value + '\nUsername: ' + username.value)
}
</script>

<template>
  <div>
    <h1>Join Room</h1>
    <input v-model="roomCode" placeholder="Room Code" />
    <input v-model="username" placeholder="Username" />
    <button class="btn btn-primary" @click="joinRoom">Join Room</button>
  </div>
</template>

<style scoped></style>
