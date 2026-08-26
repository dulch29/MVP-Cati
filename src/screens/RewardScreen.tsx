import { useEffect, useState } from 'react'
import Cati from '../cati/Cati'
import SpeechBubble from '../cati/SpeechBubble'
import { lineFor } from '../cati/dialogue'
import { REWARD_META } from '../hooks/useInventory'
import { play } from '../audio/sfx'
import type { ChallengeResult } from '../types'
import './screens.css'

interface RewardScreenProps {
  result: ChallengeResult
  onHangout: () => void
  onBack: () => void
}

export default function RewardScreen({
  result,
  onHangout,
  onBack,
}: RewardScreenProps) {
  const [line, setLine] = useState(() =>
    lineFor(result.won ? 'challengeWin' : 'challengeLose'),
  )

  useEffect(() => {
    play(result.won ? 'happy' : 'grumpy')
  }, [result.won])

  return (
    <div className="screen challenge">
      <p className="eyebrow">{result.won ? 'Nice one' : 'Next time'}</p>

      <div className="spacer" />

      <Cati
        mood={line.mood}
        size={200}
        onPoke={() => setLine(lineFor('poke'))}
      />
      <SpeechBubble text={line.text} />

      {result.reward && (
        <div className="prize">
          <span className="prize__icon" aria-hidden="true">
            {REWARD_META[result.reward.kind].icon}
          </span>
          <span className="prize__text">
            +{result.reward.amount} {REWARD_META[result.reward.kind].label}
          </span>
        </div>
      )}

      <div className="spacer" />

      <div className="stack">
        <button className="btn btn--wide" onClick={onHangout}>
          Give it to Cati
        </button>
        <button className="btn btn--wide btn--soft" onClick={onBack}>
          Back to break
        </button>
      </div>
    </div>
  )
}
