import type { Game } from '~/server/util'
import type { UUID } from '~/utils/socket-types'
import { randomUUID } from 'uncrypto'

const games = new Map<UUID, Game>()

export function getGame(uuid: UUID) {
  return games.get(uuid)
}

export function addGame(game: Game) {
  let uuid = randomUUID()
  while (games.has(uuid)) {
    uuid = randomUUID()
  }
  games.set(uuid, game)
}

export function allGames() {
  return games as ReadonlyMap<UUID, Game>
}
