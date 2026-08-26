import type { ChallengeId } from '../types'

export interface ChallengeMeta {
  id: ChallengeId
  name: string
  tagline: string
  icon: string
  /** Flip to true as each challenge lands. */
  ready: boolean
}

/**
 * The break menu. Feed Me ships first as the complete vertical slice; the rest
 * turn on here once built, with no other screen needing changes.
 */
export const CHALLENGES: ChallengeMeta[] = [
  {
    id: 'feed',
    name: 'Feed Me',
    tagline: 'She’s starving',
    icon: '🐟',
    ready: true,
  },
  {
    id: 'catch',
    name: 'Catch Me',
    tagline: 'If you can',
    icon: '🐾',
    ready: false,
  },
  {
    id: 'sleep',
    name: 'Don’t Wake',
    tagline: 'Be still',
    icon: '😴',
    ready: false,
  },
  {
    id: 'freeze',
    name: 'Freeze!',
    tagline: 'Check in',
    icon: '❄️',
    ready: false,
  },
]

export const playable = () => CHALLENGES.filter((c) => c.ready)

export function byId(id: ChallengeId): ChallengeMeta | undefined {
  return CHALLENGES.find((c) => c.id === id)
}

/**
 * Cati decides what you're playing, not the user. `avoid` is the previous
 * break's challenge, skipped where possible so two breaks in a row don't
 * repeat — unless it's the only thing built, in which case it wins by default.
 */
export function drawChallenge(avoid?: ChallengeId): ChallengeMeta {
  const pool = playable()
  const fresh = pool.filter((c) => c.id !== avoid)
  const from = fresh.length > 0 ? fresh : pool
  return from[Math.floor(Math.random() * from.length)]
}
