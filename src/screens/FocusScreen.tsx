import { useEffect, useMemo, useState } from 'react'
import Cati from '../cati/Cati'
import SpeechBubble from '../cati/SpeechBubble'
import { lineFor } from '../cati/dialogue'
import { formatClock, useCountdown } from '../hooks/useCountdown'
import { play } from '../audio/sfx'
import type { Line } from '../cati/dialogue'
import './screens.css'

const WORK_SECONDS = 25 * 60

interface FocusScreenProps {
  onComplete: () => void
  onGiveUp: () => void
}

export default function FocusScreen({ onComplete, onGiveUp }: FocusScreenProps) {
  const [line, setLine] = useState<Line>(() => lineFor('startWork'))
  // A poke answers even while paused, so it has to outrank the "Paused" text.
  const [poked, setPoked] = useState(false)

  const { remaining, running, progress, start, pause, reset, skipToEnd } =
    useCountdown({
      seconds: WORK_SECONDS,
      // She calls out the moment the session lands, before the screen changes.
      onComplete: () => {
        play('meow')
        onComplete()
      },
      autoStart: true,
    })

  // She checks in once around the halfway mark, then goes quiet again.
  const halfway = useMemo(() => Math.floor(WORK_SECONDS / 2), [])
  const [nudged, setNudged] = useState(false)
  useEffect(() => {
    if (!nudged && remaining <= halfway && remaining > halfway - 20) {
      setNudged(true)
      setLine(lineFor('midWork'))
    }
  }, [remaining, halfway, nudged])

  // Pausing or resuming is its own statement — drop back to the status text.
  useEffect(() => setPoked(false), [running])

  return (
    <div className="screen">
      <p className="eyebrow">Focus session</p>

      <div className="spacer" />

      <Cati
        mood={running ? 'focused' : 'idle'}
        size={260}
        clock={formatClock(remaining)}
        progress={progress}
        onPoke={() => {
          setLine(lineFor(running ? 'pokeWorking' : 'poke'))
          setPoked(true)
        }}
      />

      <SpeechBubble
        text={running || poked ? line.text : 'Paused. I’ll wait.'}
      />

      <div className="spacer" />

      <div className="stack">
        <div className="btn-row">
          {running ? (
            <button className="btn btn--soft" onClick={pause}>
              Pause
            </button>
          ) : (
            <button className="btn" onClick={start}>
              Resume
            </button>
          )}
          <button className="btn btn--soft" onClick={reset}>
            Reset
          </button>
        </div>
        <button className="btn btn--ghost btn--wide" onClick={onGiveUp}>
          End session
        </button>
        {import.meta.env.DEV && (
          <button className="btn btn--ghost btn--wide" onClick={skipToEnd}>
            dev: skip to end
          </button>
        )}
      </div>
    </div>
  )
}
