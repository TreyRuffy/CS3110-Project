<script setup lang="ts">
import { renderSVG } from 'uqr'
import xss from 'xss'
const props = defineProps({
  roomCode: {
    type: String,
    required: true,
  },
})

const svg = () => {
  const safeRoomCode = xss(props.roomCode)
  const hostname = useRequestURL().origin
  return renderSVG(hostname + '/join?roomCode=' + safeRoomCode)
}
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-html="svg()"></div>
</template>

<style scoped></style>
