interface GameClient {
  uuid: `${string}-${string}-${string}-${string}-${string}`
  client: Client
  score: number
  game: Game
  gameHistory: Game[]
  creationDate: Date
  host: boolean
}
