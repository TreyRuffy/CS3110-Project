export interface ServerToClientEvents {
  'successful-connection': (uuid: string) => void

  'username-error': (
    errorType: 'username-taken' | 'username-length' | 'username-invalid',
    errorMessage: string,
  ) => void
  'username-accepted': (username: string) => void

  'room-error': (
    errorType: 'room-not-found' | 'room-full' | 'room-code-invalid',
    errorMessage: string,
  ) => void
  'room-joined': (roomCode: string) => void
  'room-created': (roomCode: string) => void
  'room-player-update': (roomCode: string, players: [uuid: string, username: string][]) => void
  'update-room-settings': (settings: Record<string, unknown>) => void

  'player-kicked': (uuid: string) => void
  'self-kicked': () => void

  'game-starting': (timer: number) => void
  'game-started': (questionCount: number) => void
  'game-ended': () => void

  question: (questionNumber: number, question: string, answers: string[], image: string) => void
  'question-answered': () => void
  'question-answered-correct': (score: number) => void
  'question-answered-incorrect': (score: number) => void

  leaderboard: (leaderboard: [uuid: string, username: string, score: number][]) => void

  'invalid-action': (message: string) => void
}

export interface ClientToServerEvents {
  reauthenticate: (uuid: string, username: string) => void
  'select-username': (username: string) => void

  'join-room': (roomCode: string) => void
  'create-room': () => void
  'leave-room': () => void

  'host-update-room-settings': (settings: Record<string, unknown>) => void
  'host-kick-player': (uuid: string) => void
  'host-start-game': (timer?: number) => void
  'host-next-question': () => void

  'answer-question': (answer: string) => void
}
