import { Room, Client } from '~/server/util'

const rooms: Room[] = []

export function generateJoinCode() {
  const characters = 'ABCDEFGHJKMNPQRSTUVWXYZ123456789'
  let code = ''

  do {
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length))
    }
  } while (rooms.some((room) => room._joinCode === code))

  return code
}

export function createRoom(client: Client) {
  const room = new Room(client)
  rooms.push(room)
  return room
}

export function getAllRooms() {
  return rooms
}
