import type { RoomSettings } from '~/utils/utils'

export type UUID = `${string}-${string}-${string}-${string}-${string}`

export interface ServerToClientEvents {
  'successful-connection': (uuid: UUID) => void

  // TODO: Add reauthentication
  'reauthenticate-error': (errorMessage: string) => void
  'reauthenticate-success': () => void

  'username-error': (
    errorType: 'username-taken' | 'username-length' | 'username-invalid',
    errorMessage: string,
  ) => void
  'username-accepted': (username: string) => void

  'room-error': (
    errorType:
      | 'room-not-found'
      | 'room-full'
      | 'room-code-invalid'
      | 'not-in-room'
      | 'already-in-room'
      | 'banned',
    errorMessage: string,
  ) => void
  'room-joined': (roomCode: string) => void
  'room-created': (roomCode: string) => void
  'room-left': () => void
  'room-player-update': (roomCode: string, players: [uuid: UUID, username: string][]) => void

  // TODO: add 'update-room-settings' event
  'update-room-settings': (settings: Record<string, unknown>) => void

  'player-kicked': (uuid: UUID) => void
  'self-kicked': () => void

  'player-banned': (uuid: UUID) => void
  'self-banned': () => void

  'game-starting': (timer: number) => void
  'game-started': (questionCount: number) => void
  'game-ended': (rankings: { uuid: UUID; username: string; score: number }[]) => void
  'game-restarted': () => void
  'game-error': (
    errorType: 'game-not-started' | 'game-already-started' | 'game-not-enough-players',
    errorMessage: string,
  ) => void

  question: (questionNumber: number, question: string, image: string | undefined) => void
  'question-allow-answers': (answers: string[], timer: number) => void
  'question-answered-correct': (score: number, addedScore: number, correctAnswer: string) => void
  'question-answered-incorrect': (score: number, correctAnswer: string) => void
  'question-people-answered': (peopleAnswered: UUID[]) => void
  'question-answer-count': (answerCount: { answer: string; count: number }[]) => void

  'invalid-action': (message: string) => void

  'user-info': (
    username: string,
    uuid: UUID,
    roomCode: string,
    roomHost: boolean,
    score: number,
  ) => void
}

export interface ClientToServerEvents {
  reauthenticate: (uuid: UUID) => void

  'select-username': (roomCode: string, username: string) => void

  'join-room': (roomCode: string) => void
  'create-room': (region: string) => void

  'host-update-room-settings': (settings: Partial<RoomSettings>) => void
  'host-kick-player': (uuid: UUID) => void
  'host-ban-player': (uuid: UUID) => void
  'host-start-game': (timer?: number) => void
  'host-force-end-question': () => void
  'host-restart-game': () => void

  'question-answer': (answer: string) => void
  'question-next': () => void

  'request-user-info': () => void
}
