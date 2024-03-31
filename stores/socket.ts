import { defineStore } from 'pinia'
import { io, type Socket } from 'socket.io-client'
import type { DefaultEventsMap } from '@socket.io/component-emitter'

export const useSocketStore = defineStore('socket', () => {
  const socket = ref<null | Socket<DefaultEventsMap, DefaultEventsMap>>(null)
  function connect() {
    socket.value = io()
  }
  function disconnect() {
    if (socket.value) {
      socket.value.disconnect()
    }
  }
  onUnmounted(disconnect)
  return { socket, connect, disconnect }
})
