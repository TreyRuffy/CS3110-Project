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
    socket.on('select-username', (roomCode: string, username: string) => {
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
        if (c.username === username && clientRoom.get(c)?.joinCode === roomCode) {
          socket.emit('username-error', 'username-taken', 'Username is already taken')
          return
        }
      }
      client.username = username
      socket.emit('username-accepted', username)
    })

    socket.on('join-room', (roomCode: string) => {
      roomCode = roomCode.toUpperCase()
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
        clientRoom.delete(client)
        socket.emit('room-left')
        currentRoom.broadcast(
          'room-player-update',
          currentRoom.joinCode,
          currentRoom.players.map((p) => [p.uuid, p.username]),
        )
      }
      // if (room.bannedPlayers.has(client.uuid)) {
      //   socket.emit('room-error', 'banned', 'You are banned from this room')
      //   return
      // }
      room.addPlayer(client)
      clientRoom.set(client, room)
      socket.emit('room-joined', roomCode)
      room.broadcast(
        'room-player-update',
        room.joinCode,
        room.players.map((p) => [p.uuid, p.username]),
      )
    })

    socket.on('create-room', (region) => {
      if (clientRoom.get(client)) {
        socket.emit('room-error', 'already-in-room', 'Already in a room')
        return
      }
      clientRoom.set(client, createRoom(client))
      const currentRoom = clientRoom.get(client)
      if (!currentRoom) {
        socket.emit('room-error', 'not-in-room', 'Not in a room')
        return
      }
      socket.emit('room-created', currentRoom.joinCode)
      currentRoom.settings.quiz = region
    })

    socket.on('leave-room', () => {
      const currentRoom = clientRoom.get(client)
      if (!currentRoom) {
        socket.emit('room-error', 'not-in-room', 'Not in a room')
        return
      }
      if (currentRoom.host === client) {
        currentRoom.players.forEach((p) => {
          p.socket.emit('room-left')
          clientRoom.delete(p)
        })
        removeRoom(currentRoom)
        return
      }
      clientRoom.delete(client)
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
      currentRoom.banPlayer(player)
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

      setTimeout(() => {
        if (!currentRoom.currentGame) {
          currentRoom.startGame()
        }
      }, timer || currentRoom.settings.startTimer)
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

      const gameClient = currentRoom.currentGame.getGameClient(client)
      if (!gameClient) {
        socket.emit('game-error', 'game-not-started', 'Game not started')
        return
      }

      currentRoom.currentGame.handleAnswer(gameClient, answer)
    })

    socket.on('send-chat-message', (message: string) => {
      if (message.length < 1) {
        socket.emit('chat-error', 'message-empty', 'Message cannot be empty')
        return
      }
      if (message.length > 256) {
        socket.emit(
          'chat-error',
          'message-too-long',
          'Message cannot be longer than 200 characters',
        )
        return
      }
      const currentRoom = clientRoom.get(client)
      if (!currentRoom) {
        socket.emit('room-error', 'not-in-room', 'Not in a room')
        return
      }

      currentRoom.broadcast('receive-chat-message', client.username, message)
    })

    socket.on('request-user-info', () => {
      socket.emit(
        'user-info',
        client.username,
        client.uuid,
        clientRoom.get(client)?.joinCode ?? '',
        clientRoom.get(client)?.host === client,
        clientRoom.get(client)?.currentGame?.getGameClient(client)?.score || 0,
      )
      socket.emit(
        'room-player-update',
        clientRoom.get(client)?.joinCode ?? '',
        clientRoom.get(client)?.players.map((p) => [p.uuid, p.username]) ?? [],
      )
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

      if (currentRoom.host !== client) {
        socket.emit('invalid-action', 'Only the host can start the next question')
        return
      }

      currentRoom.currentGame.nextQuestion()
    })

    socket.on('disconnect', () => {
      const currentRoom = clientRoom.get(client)
      if (currentRoom) {
        if (currentRoom.host === client) {
          currentRoom.players.forEach((p) => {
            p.socket.emit('room-left')
            clientRoom.delete(p)
          })
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
