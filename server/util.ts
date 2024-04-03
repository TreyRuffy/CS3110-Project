import { type codeLength, generateJoinCode } from './room-manager'
import type { ServerToClientEvents } from '~/utils/socket-types'
import { type UUID } from '~/utils/socket-types'
import type { Socket } from 'socket.io'
import type { Question } from '~/utils/utils'
import { RoomSettings } from '~/utils/utils'

export class Client {
  _username
  _uuid: UUID = crypto.randomUUID()
  readonly _creationDate = new Date()
  _lastPacket = new Date()
  _gamesPlayed: UUID[] = []
  _socket: Socket

  constructor(socket: Socket, username: string)
  constructor(socket: Socket, username: string, uuid?: UUID) {
    this._username = username
    this._uuid = uuid || this._uuid
    this._socket = socket
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

  get socket() {
    return this._socket
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
  _joinCode: `${string & { length: typeof codeLength }}`
  _host: Client
  _players: Client[] = []
  _currentGame: Game | null = null
  _settings: RoomSettings = new RoomSettings()

  constructor(host: Client, joinCode?: `${string & { length: typeof codeLength }}`) {
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

  get host() {
    return this._host
  }

  get currentGame() {
    return this._currentGame
  }

  set currentGame(game: Game | null) {
    this._currentGame = game
  }

  get settings() {
    return this._settings
  }

  changeSettings(settings: Partial<RoomSettings>) {
    Object.assign(this._settings, settings)
  }

  broadcast<T extends keyof ServerToClientEvents>(
    event: T,
    ...args: Parameters<ServerToClientEvents[T]>
  ) {
    for (const player of this._players) {
      player.socket.emit(event, ...args)
    }
  }
}
