export type UUID = `${string}-${string}-${string}-${string}-${string}`

export class Client {
  _username
  _uuid: UUID = crypto.randomUUID()
  readonly _creationDate = new Date()
  _lastPacket = new Date()

  constructor(username: string)
  constructor(username: string, uuid?: UUID) {
    this._username = username
    this._uuid = uuid || this._uuid
  }

  get uuid() {
    return this._uuid
  }

  get username() {
    return this._username
  }

  set username(username: string) {
    this._username = username
  }

  get creationDate() {
    return this._creationDate
  }

  get lastPacket() {
    return this._lastPacket
  }

  set lastPacket(lastPacket: Date) {
    this._lastPacket = lastPacket
  }
}

export class GameClient {
  _client: Client
  _score = 0
  _creationDate = new Date()
  _gamesWon = 0
  _gamesPlayed = 0

  constructor(client: Client) {
    this._client = client
  }

  get uuid() {
    return this._client.uuid
  }

  get client() {
    return this._client
  }

  get score() {
    return this._score
  }

  resetScore() {
    this._score = 0
  }

  addScore(score: number) {
    this._score += score
  }

  get creationDate() {
    return this._creationDate
  }

  get gamesWon() {
    return this._gamesWon
  }

  incrementGamesWon() {
    this._gamesWon++
  }

  get gamesPlayed() {
    return this._gamesPlayed
  }

  incrementGamesPlayed() {
    this._gamesPlayed++
  }
}

export class Question {
  _question: string
  _answers: [correct: string, wrong: string[]]
  _image: string

  constructor(question: string, answers: [correct: string, wrong: string[]], image: string) {
    this._question = question
    this._answers = answers
    this._image = image
  }

  get question() {
    return this._question
  }

  get answers() {
    return this._answers
  }

  get image() {
    return this._image
  }
}

export class Game {
  _uuid: UUID = crypto.randomUUID()
  _creationDate: Date = new Date()
  _gameEnd: Date = new Date(0)
  _questions: Question[] = []
  _clients: GameClient[] = []
  _currentQuestion = 0
  _winner: GameClient | null = null

  constructor(questions: Question[]) {
    this._questions = questions
  }

  get uuid() {
    return this._uuid
  }

  get creationDate() {
    return this._creationDate
  }

  get gameEnd() {
    return this._gameEnd
  }

  set gameEnd(gameEnd: Date) {
    this._gameEnd = gameEnd
  }

  get questions() {
    return this._questions
  }

  get clients() {
    return this._clients
  }

  get currentQuestion() {
    return this._currentQuestion
  }

  set currentQuestion(currentQuestion: number) {
    this._currentQuestion = currentQuestion
  }

  get winner() {
    return this._winner
  }

  set winner(winner: GameClient | null) {
    this._winner = winner
  }

  addClient(client: GameClient) {
    this._clients.push(client)
  }

  removeClient(client: GameClient) {
    this._clients = this._clients.filter((c) => c !== client)
  }

  get duration() {
    return this._gameEnd.getTime() - this._creationDate.getTime()
  }

  get isOver() {
    return this._gameEnd.getTime() !== 0
  }
}

export class Room {
  _uuid: UUID = crypto.randomUUID()
  _creationDate: Date = new Date()
  _players: Client[] = []
  _winner: Client | null = null
  _currentGame: Game | null = null
  _host: Client
  _joinCode

  constructor(host: Client, joinCode: string) {
    this._host = host
    this._joinCode = joinCode
  }

  get uuid() {
    return this._uuid
  }

  get creationDate() {
    return this._creationDate
  }

  get players() {
    return this._players
  }

  get winner() {
    return this._winner
  }

  set winner(winner: Client | null) {
    this._winner = winner
  }

  addPlayer(player: Client) {
    this._players.push(player)
  }

  removePlayer(player: Client) {
    this._players = this._players.filter((p) => p !== player)
  }
}
