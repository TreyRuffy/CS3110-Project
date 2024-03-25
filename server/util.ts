import { generateJoinCode } from './room-manager'

export type UUID = `${string}-${string}-${string}-${string}-${string}`

export function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }

  return array
}

export interface Question {
  question: string
  answers: [correct: string, wrong: string[]]
  image?: string
  questionLength?: number
}

export class Client {
  _username
  _uuid: UUID = crypto.randomUUID()
  readonly _creationDate = new Date()
  _lastPacket = new Date()
  _gamesPlayed: UUID[] = []

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

  get gamesPlayed() {
    return this._gamesPlayed
  }

  addGame(gameUuid: UUID) {
    this._gamesPlayed.push(gameUuid)
  }
}

export class GameClient {
  _client: Client
  _score = 0

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
}

export class Game {
  _uuid: UUID = crypto.randomUUID()
  _creationDate: Date = new Date()
  _questions: Question[] = []
  _currentQuestion = 0
  _rankings: GameClient[] = []
  _gameEnd: Date = new Date(0)

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

  get currentQuestion() {
    return this._currentQuestion
  }

  set currentQuestion(currentQuestion: number) {
    this._currentQuestion = currentQuestion
  }

  addClient(client: GameClient) {
    this._rankings.push(client)
  }

  removeClient(client: GameClient) {
    this._rankings = this._rankings.filter((c) => c !== client)
  }

  sortRankings() {
    this._rankings.sort((a, b) => b.score - a.score)
  }

  get duration() {
    return this._gameEnd.getTime() - this._creationDate.getTime()
  }

  get isFinished() {
    return this._gameEnd.getTime() !== 0
  }
}

export class Room {
  _uuid: UUID = crypto.randomUUID()
  _creationDate: Date = new Date()
  _joinCode
  _host: Client
  _players: Client[] = []
  _currentGame: Game | null = null

  constructor(host: Client, joinCode?: string) {
    this._host = host
    this._joinCode = joinCode || generateJoinCode()
  }

  get uuid() {
    return this._uuid
  }

  get joinCode() {
    return this._joinCode
  }

  get creationDate() {
    return this._creationDate
  }

  get players() {
    return this._players
  }

  addPlayer(player: Client) {
    this._players.push(player)
  }

  removePlayer(player: Client) {
    this._players = this._players.filter((p) => p !== player)
  }
}
