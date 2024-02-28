import { defineIOHandler } from 'nuxt3-socket.io/helpers'

const clients: Record<string, Client> = {}

export default defineIOHandler((io) => {
  io.on('connection', (socket) => {
    let uuid = crypto.randomUUID()
    const creationDate = Date.now()
    clients[uuid] = {
      uuid,
      creationDate,
      lastPacket: creationDate,
    }

    socket.on('hello', (arg) => {
      io.emit(
        'hello-response',
        clients[uuid].username ? clients[uuid].username : socket.id,
        arg,
        Date(),
      )
    })

    socket.on('all-dark', (arg) => {
      io.emit('dark', arg === true)
    })

    socket.on(
      'handshake',
      (username: string, newUuid: `${string}-${string}-${string}-${string}-${string}` | null) => {
        if (newUuid) {
          delete clients[uuid]
          uuid = newUuid
        }
        const lastPacket = Date.now()
        if (!clients[uuid]) {
          clients[uuid] = {
            uuid,
            creationDate: lastPacket,
            lastPacket,
          }
        }
        clients[uuid].username = username
        io.emit('handshake-response', uuid, lastPacket)
      },
    )
  })
})
