import { defineIOHandler } from 'nuxt3-socket.io/helpers'
import { Client, shuffle, type UUID } from '../util'
// noinspection ES6PreferShortImport
import { createQuestions } from '../../utils/countries'

const clients: Record<UUID, Client> = {}

// noinspection JSUnusedGlobalSymbols
export default defineIOHandler((io) => {
  io.on('connection', (socket) => {
    let client = new Client(socket.id)
    clients[client.uuid] = client

    socket.on('hello', (arg) => {
      io.emit('hello-response', client.username, arg, Date())
    })

    socket.on('all-dark', (arg) => {
      io.emit('dark', arg === true)
    })

    socket.on('reauth', (uuid: UUID, username: string) => {
      // TODO - add more authentication logic before allowing re-authentication
      // JWTs? OAuth? etc.
      if (clients[uuid] && clients[uuid].username === username) {
        clients[uuid].lastPacket = new Date()
        delete clients[client.uuid]
        client = clients[uuid]
      }
    })

    socket.on('new-username', (username: string) => {
      client.username = username
    })

    let lastCorrectQuestion = ''
    socket.on('generate-question', async () => {
      await createQuestions().then((question) => {
        socket.emit('question', {
          question: question.question,
          answers: shuffle(question.answers.flat()),
          image: question.image,
        } as any)
        lastCorrectQuestion = question.answers[0]
      })
    })

    let score = 0
    socket.on('answer', async (answer: string) => {
      if (answer === lastCorrectQuestion) {
        socket.emit('score', ++score as any)
        await createQuestions().then((question) => {
          socket.emit('question', {
            question: question.question,
            answers: shuffle(question.answers.flat()),
            image: question.image,
          } as any)
          lastCorrectQuestion = question.answers[0]
        })
      } else {
        socket.emit('wrong-answer', answer as any)
      }
    })
  })
})
