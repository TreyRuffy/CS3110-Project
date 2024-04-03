import type { Server } from 'http'
import { Server as SocketServer } from 'socket.io'
// import { CountriesBuilder, createQuestions } from '~/utils/countries'
import { Client, type UUID } from '../util'
import type { ClientToServerEvents, ServerToClientEvents } from '~/utils/socket-types'

const clients: Map<UUID, Client> = new Map()

export default defineEventHandler((event) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const httpServer = (event.node.req.socket as any).server as Server
  const io = new SocketServer<ClientToServerEvents, ServerToClientEvents>(httpServer)

  io.on('connection', (socket) => {
    const client = new Client(socket.id)
    clients.set(client.uuid, client)

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

    //   socket.on('hello', (arg) => {
    //     io.emit('hello-response', client.username, arg, Date())
    //   })
    //
    //   socket.on('all-dark', (arg) => {
    //     io.emit('dark', arg === true)
    //   })
    //
    //   socket.on('reauth', (uuid: UUID, username: string) => {
    //     // TODO - add more authentication logic before allowing re-authentication
    //     // JWTs? OAuth?
    //
    //     const client = clients.get(uuid)
    //     if (client && client.username === username) {
    //       client.lastPacket = new Date()
    //     }
    //   })
    //
    //   socket.on('new-username', (username: string) => {
    //     client.username = username
    //   })
    //
    //   let lastCorrectQuestion = ''
    //   socket.on('generate-question', () => {
    //     const countries = new CountriesBuilder()
    //     countries.all()
    //     countries.build().then((countries) => {
    //       const question = createQuestions(countries, 1)[0]
    //       socket.emit('question', {
    //         question: question.question,
    //         answers: shuffle(question.answers.flat()) as string[],
    //         image: question.image,
    //       })
    //       lastCorrectQuestion = question.answers[0]
    //     })
    //   })
    //
    //   let score = 0
    //   socket.on('answer', (answer: string) => {
    //     if (answer === lastCorrectQuestion) {
    //       socket.emit('score', ++score)
    //       const countries = new CountriesBuilder().all()
    //       countries.build().then((countries) => {
    //         const question = createQuestions(countries, 1)[0]
    //         socket.emit('question', {
    //           question: question.question,
    //           answers: shuffle(question.answers.flat()),
    //           image: question.image,
    //         })
    //         lastCorrectQuestion = question.answers[0]
    //       })
    //     } else {
    //       socket.emit('wrong-answer', answer)
    //     }
    //   })
  })
})
