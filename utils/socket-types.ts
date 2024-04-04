import type { RoomSettings } from '~/utils/utils'

export type UUID = `${string}-${string}-${string}-${string}-${string}`

export interface ServerToClientEvents {
  'successful-connection': (uuid: UUID) => void

  'reauthenticate-error': (errorMessage: string) => void
  'reauthenticate-success': () => void

  'username-error': (
    errorType: 'username-taken' | 'username-length' | 'username-invalid',
    errorMessage: string,
  ) => void
  'username-accepted': (username: string) => void

  'room-error': (
    errorType: 'room-not-found' | 'room-full' | 'room-code-invalid' | 'not-in-room',
    errorMessage: string,
  ) => void
  'room-joined': (roomCode: string) => void
  'room-created': (roomCode: string) => void
  'room-left': () => void
  'room-player-update': (roomCode: string, players: [uuid: UUID, username: string][]) => void
  'update-room-settings': (settings: Record<string, unknown>) => void

  'player-kicked': (uuid: UUID) => void
  'self-kicked': () => void

  'player-banned': (uuid: UUID) => void
  'self-banned': () => void

  'game-starting': (timer: number) => void
  'game-started': (questionCount: number) => void
  'game-ended': () => void
  'game-error': (
    errorType: 'game-not-started' | 'game-already-started',
    errorMessage: string,
  ) => void

  question: (questionNumber: number, question: string, answers: string[], image: string) => void
  'question-answered': () => void
  'question-answered-correct': (score: number) => void
  'question-answered-incorrect': (score: number) => void

  leaderboard: (leaderboard: [uuid: UUID, username: string, score: number][]) => void

  'invalid-action': (message: string) => void

  'receive-chat-message': (username: string, message: string) => void
}

export interface ClientToServerEvents {
  reauthenticate: (uuid: UUID) => void

  'select-username': (username: string) => void

  'join-room': (roomCode: string) => void
  'create-room': () => void
  'leave-room': () => void

  'host-update-room-settings': (settings: Partial<RoomSettings>) => void
  'host-kick-player': (uuid: UUID) => void
  'host-ban-player': (uuid: UUID) => void
  'host-start-game': (timer?: number) => void
  'host-next-question': () => void

  'answer-question': (answer: string) => void

  'send-chat-message': (message: string) => void
}
