import { useState } from 'react'
import Cati from '../cati/Cati'
import SpeechBubble from '../cati/SpeechBubble'
import { lineFor } from '../cati/dialogue'
import { formatClock, useCountdown } from '../hooks/useCountdown'
import { drawChallenge } from '../challenges/registry'
import type { ChallengeId } from '../types'
import './screens.css'

const BREAK_SECONDS = 5 * 60

interface BreakScreenProps {
  /** Last break's challenge, so the draw can avoid an immediate repeat. */
  lastPlayed?: ChallengeId
  onPlay: (id: ChallengeId) => void
  onContinue: () => void
  onStop: () => void
}

export default function BreakScreen({
  lastPlayed,
  onPlay,
  onContinue,
  onStop,
}: BreakScreenProps) {
  const [line, setLine] = useState(() => lineFor('startBreak'))
  // A poke answers even after the break ends, so it outranks the wrap-up text.
  const [poked, setPoked] = useState(false)
  // Drawn once on mount. Cati picks — there's no menu to change it.
  const [pick] = useState(() => drawChallenge(lastPlayed))
  const [over, setOver] = useState(false)

  const { remaining, progress } = useCountdown({
    seconds: BREAK_SECONDS,
    onComplete: () => setOver(true),
    autoStart: true,
  })

  return (
    <div className="screen">
      <p className="eyebrow">Break</p>

      <Cati
        mood={over ? 'idle' : 'happy'}
        size={200}
        clock={formatClock(remaining)}
        progress={progress}
        onPoke={() => {
          setLine(lineFor('poke'))
          setPoked(true)
        }}
      />

      <SpeechBubble
        text={over && !poked ? 'Break’s over. Another round?' : line.text}
      />

      {!over && (
        <div className="pick">
          <p className="pick__label">I’ve picked our game</p>
          <button className="pick__card" onClick={() => onPlay(pick.id)}>
            <span className="pick__icon" aria-hidden="true">
              {pick.icon}
            </span>
            <span className="pick__text">
              <span className="pick__name">{pick.name}</span>
              <span className="pick__tagline">{pick.tagline}</span>
            </span>
            <span className="pick__go" aria-hidden="true">
              Play
            </span>
          </button>
        </div>
      )}

      <div className="spacer" />

      <div className="btn-row">
        <button className="btn btn--soft" onClick={onStop}>
          Stop
        </button>
        <button className="btn" onClick={onContinue}>
          Continue
        </button>
      </div>
    </div>
  )
}
