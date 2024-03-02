import { defineIOHandler } from 'nuxt3-socket.io/helpers'
import { Client, type UUID } from '../util'
import { createQuestions } from '../countries'

const clients: Record<UUID, Client> = {}

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

    socket.on('generate-question', async () => {
      await createQuestions().then((question) => {
        socket.emit('question', question as any)
      })
    })
  })
})
