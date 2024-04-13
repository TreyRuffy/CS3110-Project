<script setup lang="ts">
const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
  event.preventDefault()
  event.returnValue = true
}

useEventListener('beforeunload', beforeUnloadHandler)
</script>

<template>
  <div>
    <RoomTopNavigation :max-question-number="10" :question-number="0" :score="12000" />
    <h1 class="mb-2 mt-4 text-center text-2xl font-semibold">Waiting Room</h1>
    <div class="grid grid-cols-2">
      <div class="">
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
      </div>
      <div class="grid grid-flow-row justify-center">
        <RoomCode room-code="1234" />
        <h1>Go to link link here</h1>
      </div>
    </div>

    <!-- <button
      class="btn btn-error m-2"
      @click="socket && socket.emit('all-dark', useColorMode().preference !== 'dark')"
    >
      All Dark
    </button> -->
  </div>
</template>

<style scoped></style>
