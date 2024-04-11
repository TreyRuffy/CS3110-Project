import type { Server } from 'http'
import { Server as SocketServer } from 'socket.io'
import { Client, type Room } from '../util'
import type { ClientToServerEvents, ServerToClientEvents, UUID } from '~/utils/socket-types'
import type { JoinCode } from '~/server/room-manager'
import { codeLength, createRoom, getAllRooms, removeRoom } from '~/server/room-manager'
import { createQuizzes } from '~/utils/countries'
import { randomUUID } from 'uncrypto'

const clients: Map<UUID, Client> = new Map()
const clientRoom: Map<Client, Room> = new Map()

export default defineEventHandler((event) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const httpServer = (event.node.req.socket as any).server as Server
  const io = new SocketServer<ClientToServerEvents, ServerToClientEvents>(httpServer)

  createQuizzes().then(() => {
    return
  })

  io.on('connection', (socket) => {
    let uuid = randomUUID()
    while (clients.has(uuid)) {
      uuid = randomUUID()
    }

    let client = new Client(socket, socket.id, uuid)
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
      if (username.length < 2) {
        socket.emit('username-error', 'username-length', 'Username must be at least 2 characters')
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
      const currentRoom = clientRoom.get(client)
      if (currentRoom) {
        currentRoom.removePlayer(client)
        socket.emit('room-left')
        currentRoom.broadcast(
          'room-player-update',
          currentRoom.joinCode,
          currentRoom.players.map((p) => [p.uuid, p.username]),
        )
      }
      room.addPlayer(client)
      clientRoom.set(client, room)
      socket.emit('room-joined', roomCode)
      room.broadcast(
        'room-player-update',
        room.joinCode,
        room.players.map((p) => [p.uuid, p.username]),
      )
    })

    socket.on('create-room', () => {
      clientRoom.set(client, createRoom(client))
      const currentRoom = clientRoom.get(client)
      if (!currentRoom) {
        socket.emit('room-error', 'not-in-room', 'Not in a room')
        return
      }
      socket.emit('room-created', currentRoom.joinCode)
    })

    socket.on('leave-room', () => {
      const currentRoom = clientRoom.get(client)
      if (!currentRoom) {
        socket.emit('room-error', 'not-in-room', 'Not in a room')
        return
      }
      if (currentRoom.host === client) {
        removeRoom(currentRoom)
        return
      }
      currentRoom.removePlayer(client)
      socket.emit('room-left')
      currentRoom.broadcast(
        'room-player-update',
        currentRoom.joinCode,
        currentRoom.players.map((p) => [p.uuid, p.username]),
      )
    })

    socket.on('host-update-room-settings', (settings) => {
      const currentRoom = clientRoom.get(client)
      if (!currentRoom) {
        socket.emit('room-error', 'not-in-room', 'Not in a room')
        return
      }
      if (currentRoom.host !== client) {
        socket.emit('invalid-action', 'Only the host can update room settings')
        return
      }
      currentRoom.changeSettings(settings)
      currentRoom.broadcast('update-room-settings', settings)
    })

    socket.on('host-kick-player', (uuid: UUID) => {
      const currentRoom = clientRoom.get(client)
      if (!currentRoom) {
        socket.emit('room-error', 'not-in-room', 'Not in a room')
        return
      }
      if (currentRoom.host !== client) {
        socket.emit('invalid-action', 'Only the host can kick players')
        return
      }
      if (currentRoom.host === clients.get(uuid)) {
        socket.emit('invalid-action', 'Cannot kick the host')
        return
      }
      const player = clients.get(uuid)
      if (!player) {
        socket.emit('invalid-action', 'Player not found')
        return
      }
      currentRoom.removePlayer(player)
      player.socket.emit('self-kicked', client.uuid)
      socket.emit('player-kicked', player.uuid)
      currentRoom.broadcast(
        'room-player-update',
        currentRoom.joinCode,
        currentRoom.players.map((p) => [p.uuid, p.username]),
      )
    })

    socket.on('host-ban-player', (uuid: UUID) => {
      const currentRoom = clientRoom.get(client)
      if (!currentRoom) {
        socket.emit('room-error', 'not-in-room', 'Not in a room')
        return
      }
      if (currentRoom.host !== client) {
        socket.emit('invalid-action', 'Only the host can ban players')
        return
      }
      if (currentRoom.host === clients.get(uuid)) {
        socket.emit('invalid-action', 'Cannot ban the host')
        return
      }
      const player = clients.get(uuid)
      if (!player) {
        socket.emit('invalid-action', 'Player not found')
        return
      }
      // TODO: Implement ban player
      currentRoom.removePlayer(player)
      player.socket.emit('self-banned', client.uuid)
      socket.emit('player-banned', player.uuid)
      currentRoom.broadcast(
        'room-player-update',
        currentRoom.joinCode,
        currentRoom.players.map((p) => [p.uuid, p.username]),
      )
    })

    socket.on('host-start-game', (timer?: number) => {
      const currentRoom = clientRoom.get(client)
      if (!currentRoom) {
        socket.emit('room-error', 'not-in-room', 'Not in a room')
        return
      }
      if (currentRoom.host !== client) {
        socket.emit('invalid-action', 'Only the host can start the game')
        return
      }
      currentRoom.broadcast('game-starting', timer || currentRoom.settings.startTimer)

      // creaate thread
      currentRoom.currentGame
    })

    socket.on('host-next-question', () => {
      const currentRoom = clientRoom.get(client)
      if (!currentRoom) {
        socket.emit('room-error', 'not-in-room', 'Not in a room')
        return
      }
      if (currentRoom.host !== client) {
        socket.emit('invalid-action', 'Only the host can move to the next question')
        return
      }
      // TODO: Implement next question
    })

    socket.on('question-answer', (answer: string) => {
      const currentRoom = clientRoom.get(client)
      if (!currentRoom) {
        socket.emit('room-error', 'not-in-room', 'Not in a room')
        return
      }

      if (!currentRoom.currentGame) {
        socket.emit('game-error', 'game-not-started', 'Game not started')
        return
      }

      console.log(answer)

      // TODO: Implement answer question
      const gameClient = currentRoom.currentGame.getGameClient(client)
      if (!gameClient) {
        socket.emit('game-error', 'game-not-started', 'Game not started')
        return
      }

      currentRoom.currentGame.handleAnswer(gameClient, answer)
    })

    // TODO: Implement questions and leaderboard

    socket.on('send-chat-message', (message: string) => {
      const currentRoom = clientRoom.get(client)
      if (!currentRoom) {
        socket.emit('room-error', 'not-in-room', 'Not in a room')
        return
      }

      currentRoom.broadcast('receive-chat-message', client.username, message)
    })

    socket.on('question-next', () => {
      const currentRoom = clientRoom.get(client)
      if (!currentRoom) {
        socket.emit('room-error', 'not-in-room', 'Not in a room')
        return
      }

      if (!currentRoom.currentGame) {
        socket.emit('game-error', 'game-not-started', 'Game not started')
        return
      }

      currentRoom.currentGame.nextQuestion()
    })

    socket.on('disconnect', () => {
      const currentRoom = clientRoom.get(client)
      if (currentRoom) {
        if (currentRoom.host === client) {
          removeRoom(currentRoom)
          return
        }
        currentRoom.removePlayer(client)
        currentRoom.broadcast(
          'room-player-update',
          currentRoom.joinCode,
          currentRoom.players.map((p) => [p.uuid, p.username]),
        )
      }
    })
  })
})

export function getClientRoom() {
  return clientRoom
}
