interface Client {
  uuid: `${string}-${string}-${string}-${string}-${string}`
  username?: string
  creationDate: number
  lastPacket: number
  currentRoom?: string
  gamesWon?: Game[]
  gamesPlayed?: Game[]
}
