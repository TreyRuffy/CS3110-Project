import { defineStore } from 'pinia'
import { io, type Socket } from 'socket.io-client'
import type { ClientToServerEvents, ServerToClientEvents } from '~/utils/socket-types'

export const useSocketStore = defineStore('socket', () => {
  const socket = ref<null | Socket<ServerToClientEvents, ClientToServerEvents>>(null)
  function connect() {
    if (!socket.value || socket.value.disconnected) {
      socket.value = io()
    }
  }
  function disconnect() {
    if (socket.value && !socket.value.disconnected) {
      socket.value.disconnect()
    }
  }
  onUnmounted(disconnect)
  return { socket, connect, disconnect }
})
