import { type codeLength, generateJoinCode } from './room-manager'
import type { Socket } from 'socket.io'
import type { Question } from '~/utils/utils'
import { RoomSettings } from '~/utils/utils'
import type { ServerToClientEvents, UUID } from '~/utils/socket-types'

export class Client {
  private _username
  private readonly _uuid: UUID
  private readonly _creationDate = new Date()
  private _lastPacket = new Date()
  private _gamesPlayed: UUID[] = []
  private _socket: Socket

  constructor(socket: Socket, username: string, uuid: UUID) {
    this._username = username
    this._uuid = uuid
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

  set socket(socket: Socket) {
    this._socket = socket
  }
}

export class GameClient {
  private readonly _client: Client
  private _score = 0

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
  private _creationDate: Date = new Date()
  private readonly _questions: Question[] = []
  private _currentQuestion = 0
  private _rankings: GameClient[] = []
  private _gameEnd: Date = new Date(0)

  constructor(questions: Question[]) {
    this._questions = questions
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
  private _creationDate: Date = new Date()
  private readonly _joinCode: `${string & { length: typeof codeLength }}`
  private _host: Client
  private _players: Client[] = []
  private _currentGame: Game | null = null
  private _settings: RoomSettings = new RoomSettings()

  constructor(host: Client, joinCode?: `${string & { length: typeof codeLength }}`) {
    this._host = host
    this._joinCode = joinCode || generateJoinCode()
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

  set host(host: Client) {
    this._host = host
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
