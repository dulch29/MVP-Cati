import { useState } from 'react'
import Cati from '../cati/Cati'
import SpeechBubble from '../cati/SpeechBubble'
import type { ChallengeResult, Mood } from '../types'
import './challenges.css'

interface FeedMeProps {
  onFinish: (result: ChallengeResult) => void
}

const BITES_NEEDED = 3

/**
 * Feed Me: Cati is hungry, you tap fish into her bowl. Low-stakes on purpose —
 * it is the warm-up challenge and it always ends well.
 */
export default function FeedMe({ onFinish }: FeedMeProps) {
  const [bites, setBites] = useState(0)
  const [full, setFull] = useState(false)

  const feed = () => {
    if (full) return
    const next = bites + 1
    setBites(next)
    if (next >= BITES_NEEDED) {
      setFull(true)
      window.setTimeout(
        () => onFinish({ won: true, reward: { kind: 'coin', amount: 1 } }),
        1500,
      )
    }
  }

  const mood: Mood = full ? 'happy' : 'hungry'
  const text = full
    ? 'Nom nom nom... okay you can stay.'
    : bites === 0
      ? 'I am STARVING. Feed me. Now.'
      : bites === 1
        ? 'More! That was barely a snack.'
        : 'One more. I mean it this time.'

  return (
    <div className="screen challenge">
      <p className="eyebrow">Feed Me</p>

      <div className="spacer" />

      <Cati mood={mood} size={200} />
      <SpeechBubble text={text} />

      <div className="bites" aria-label={`${bites} of ${BITES_NEEDED} fed`}>
        {Array.from({ length: BITES_NEEDED }, (_, i) => (
          <span
            key={i}
            className={`bite${i < bites ? ' bite--done' : ''}`}
            aria-hidden="true"
          >
            🐟
          </span>
        ))}
      </div>

      <div className="spacer" />

      <button
        className="btn btn--wide feed-btn"
        onClick={feed}
        disabled={full}
      >
        {full ? 'Good kitty' : 'Give a fish 🐟'}
      </button>
    </div>
  )
}
