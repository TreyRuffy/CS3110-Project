<script setup lang="ts">
const socketStore = useSocketStore()
const socket = computed({
  get: () => socketStore.socket,
  set: (value) => {
    socketStore.socket = value
  },
})
</script>

<template>
  <div>
    <h1>Waiting Room</h1>
    <div>Room Code: 123456</div>
    <RoomCode room-code="123456" class="w-[150px]" />
    <PlayerList
      :players="[
        'Mike',
        'AJ',
        'Trey',
        'Daniel',
        'Maddie',
        'Ash',
        'Peter',
        'David',
        'Liam',
        'Kelly',
      ]"
    />
    <!-- <button
      class="btn btn-error m-2"
      @click="socket && socket.emit('all-dark', useColorMode().preference !== 'dark')"
    >
      All Dark
    </button> -->
  </div>
</template>

<style scoped></style>
