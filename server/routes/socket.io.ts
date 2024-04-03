import type { Server } from 'http'
import { Server as SocketServer } from 'socket.io'
// import { CountriesBuilder, createQuestions } from '~/utils/countries'
import { Client } from '../util'
import type { ClientToServerEvents, ServerToClientEvents, UUID } from '~/utils/socket-types'
import type { JoinCode } from '~/server/room-manager'
import { codeLength, getAllRooms } from '~/server/room-manager'

const clients: Map<UUID, Client> = new Map()

export default defineEventHandler((event) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const httpServer = (event.node.req.socket as any).server as Server
  const io = new SocketServer<ClientToServerEvents, ServerToClientEvents>(httpServer)

  io.on('connection', (socket) => {
    let client = new Client(socket, socket.id)
    clients.set(client.uuid, client)
    socket.emit('successful-connection', client.uuid)

    socket.on('reauthenticate', (uuid: UUID) => {
      const oldClient = clients.get(uuid)
      if (!oldClient) {
        socket.emit('reauthenticate-error', 'Client data not found')
        return
      }
      clients.delete(client.uuid)
      client = oldClient
      client.lastPacket = new Date()
      socket.emit('reauthenticate-success')
    })

    /**
     * Select a username for the client.
     * If the username is already taken, emit a 'username-taken' event.
     * If the username is available, set the client's username and emit a 'username-accepted' event.
     */
    socket.on('select-username', (username: string) => {
      if (username.length < 3) {
        socket.emit('username-error', 'username-length', 'Username must be at least 3 characters')
        return
      }
      if (username.length > 20) {
        socket.emit('username-error', 'username-length', 'Username must be at most 20 characters')
        return
      }
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        socket.emit(
          'username-error',
          'username-invalid',
          'Username must only contain letters, numbers, and underscores',
        )
        return
      }
      for (const c of clients.values()) {
        if (c.username === username) {
          socket.emit('username-error', 'username-taken', 'Username is already taken')
          return
        }
      }
      client.username = username
      socket.emit('username-accepted', username)
    })

    socket.on('join-room', (roomCode: string) => {
      if (roomCode.length !== codeLength) {
        socket.emit('room-error', 'room-code-invalid', 'Room code must be 6 characters')
      }
      const room = getAllRooms().get(<JoinCode>roomCode)
      if (!room) {
        socket.emit('room-error', 'room-not-found', 'Room not found')
        return
      }
      if (room.players.length >= room.settings.maxPlayers) {
        socket.emit('room-error', 'room-full', 'Room is full')
        return
      }
      room.addPlayer(client)
      socket.emit('room-joined', roomCode)
      room.broadcast(
        'room-player-update',
        room.joinCode,
        room.players.map((p) => [p.uuid, p.username]),
      )
    })

    socket.on('create-room', () => {})
  })
})
