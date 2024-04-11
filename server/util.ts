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
  private _questionAnswered = false

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

  get questionAnswered() {
    return this._questionAnswered
  }

  resetScore() {
    this._score = 0
  }

  addScore(score: number) {
    this._score += score
  }

  answerQuestion() {
    this._questionAnswered = true
  }

  resetQuestion() {
    this._questionAnswered = false
  }
}

export type GameState = 'not-started' | 'in-question' | 'paused' | 'finished'

export class Game {
  private readonly _questions: Question[] = []
  private _creationDate: Date = new Date()
  private _currentQuestion = 0
  private _rankings: GameClient[] = []
  private _gameEnd: Date = new Date(0)
  private _state: GameState = 'not-started'
  private _room: Room
  private _questionTimeoutId: NodeJS.Timeout | null = null

  constructor(room: Room, questions: Question[]) {
    this._room = room
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

  getGameClient(client: Client) {
    return this._rankings.find((c) => c.client === client)
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
    return this._state === 'finished'
  }

  async startGame() {}

  async nextQuestion() {
    if (this._currentQuestion >= this._questions.length) {
      this._state = 'finished'
      this._room.broadcast('game-ended')
      return
    }

    if (this._state === 'in-question' || this._state === 'finished') {
      return
    }

    // Move to the next question
    const question = this._questions[this._currentQuestion]

    // Broadcast the question
    this._room.broadcast(
      'question',
      this._currentQuestion,
      question.question,
      question.shuffledAnswers(),
      question.image,
    )

    // Set the state to in-question
    setTimeout(() => {
      this._room.broadcast('question-allow-answers')
      this._state = 'in-question'

      this._questionTimeoutId = setTimeout(() => {
        this.finishQuestion()
      }, 10 * 1000)
    }, 5 * 1000)
  }

  async handleAnswer(client: GameClient, answer: string) {
    if (this._state !== 'in-question') {
      client.client.socket.emit(
        'game-error',
        'question-not-allowed',
        'The game is not allowing questions right now, skill issue!',
      )
      return
    }

    client.answerQuestion()

    const question = this._questions[this._currentQuestion]
    if (question.correctAnswer() === answer) {
      client.addScore(1)
      this._room.broadcast('question-answered-correct', client.score)
    } else {
      this._room.broadcast('question-answered-incorrect', client.score)
    }

    const allAnswered = this._rankings.every((c) => c.questionAnswered)
    if (allAnswered) {
      this.finishQuestion()
    }
  }

  async finishQuestion() {
    if (this._state !== 'in-question') {
      return
    }

    if (this._questionTimeoutId) {
      clearTimeout(this._questionTimeoutId)
      this._questionTimeoutId = null
    }

    this._state = 'paused'
    this._currentQuestion++

    this._room.broadcast('question-finished')
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
