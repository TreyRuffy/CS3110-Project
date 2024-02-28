interface Room {
  uuid: `${string}-${string}-${string}-${string}-${string}`
  joinCode: string
  name: string
  creationDate: Date
  clients: Client[]
  currentGame: Game
  gameHistory: Game[]
}
