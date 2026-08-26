import { useState } from 'react'
import Cati from '../cati/Cati'
import SpeechBubble from '../cati/SpeechBubble'
import { lineFor } from '../cati/dialogue'
import { REWARD_META } from '../hooks/useInventory'
import type { Inventory, Mood, RewardKind } from '../types'
import './screens.css'

interface HangoutScreenProps {
  inventory: Inventory
  onSpend: (kind: RewardKind) => boolean
  onBack: () => void
  backLabel: string
}

/** Where rewards get spent: the payoff for finishing a challenge. */
export default function HangoutScreen({
  inventory,
  onSpend,
  onBack,
  backLabel,
}: HangoutScreenProps) {
  const [line, setLine] = useState(() => lineFor('hangout'))
  const [mood, setMood] = useState<Mood>('idle')

  const use = (kind: RewardKind) => {
    if (!onSpend(kind)) {
      setLine({ text: 'You have none left. Go win me some!', mood: 'teasing' })
      setMood('teasing')
      return
    }
    const next = lineFor(kind === 'food' ? 'fed' : 'played')
    setLine(next)
    setMood(next.mood)
  }

  const pet = () => {
    setLine({ text: 'Purrrrrrr. Okay, again.', mood: 'happy' })
    setMood('happy')
  }

  return (
    <div className="screen">
      <p className="eyebrow">Hanging out</p>

      <div className="spacer" />

      <Cati
        mood={mood}
        size={220}
        onPoke={() => {
          const next = lineFor('poke')
          setLine(next)
          setMood(next.mood)
        }}
      />
      <SpeechBubble text={line.text} />

      <div className="spacer" />

      <div className="stack">
        <button className="btn btn--wide btn--mint" onClick={pet}>
          Pet Cati
        </button>
        <div className="btn-row">
          {(['food', 'toy'] as const).map((kind) => (
            <button
              key={kind}
              className="btn btn--soft"
              onClick={() => use(kind)}
            >
              {REWARD_META[kind].icon} {inventory[kind]}
            </button>
          ))}
        </div>
        <button className="btn btn--ghost btn--wide" onClick={onBack}>
          {backLabel}
        </button>
      </div>
    </div>
  )
}
