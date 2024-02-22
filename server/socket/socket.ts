import { defineIOHandler } from 'nuxt3-socket.io/helpers'

export default defineIOHandler((io) => {
  io.on('connection', (socket) => {
    /* eslint-disable-next-line no-console */
    console.log('Connected', socket.id)

    socket.on('hello', (arg) => {
      /* eslint-disable-next-line no-console */
      console.log(socket.id + ' [' + Date() + ']: ' + arg)
      io.emit('hello-response', socket.id, arg, Date())
    })

    socket.on('all-dark', (arg) => {
      io.emit('dark', arg === true)
    })
  })
})
