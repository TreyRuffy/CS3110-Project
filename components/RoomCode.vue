<script setup lang="ts">
import { renderSVG } from 'uqr'
import xss from 'xss'
const props = defineProps({
  roomCode: {
    type: String,
    required: true,
  },
})

const safeRoomCode = xss(props.roomCode)
const hostname = useRequestURL().origin

const svg = () => {
  return renderSVG(hostname + '/join?roomCode=' + safeRoomCode)
}
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div @click="copyRoomCode(safeRoomCode, hostname)" v-html="svg()"></div>
</template>

<style scoped></style>
