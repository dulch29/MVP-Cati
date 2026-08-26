import { useState } from 'react'
import Cati from '../cati/Cati'
import SpeechBubble from '../cati/SpeechBubble'
import { lineFor } from '../cati/dialogue'
import { REWARD_META } from '../hooks/useInventory'
import type { Inventory } from '../types'
import './screens.css'

interface HomeScreenProps {
  inventory: Inventory
  onStartFocus: () => void
  onHangout: () => void
}

export default function HomeScreen({
  inventory,
  onStartFocus,
  onHangout,
}: HomeScreenProps) {
  const [line, setLine] = useState(() => lineFor('greet'))
  const hasTreats = inventory.food + inventory.toy > 0

  return (
    <div className="screen">
      <header className="home__header">
        <h1 className="home__wordmark">Cati</h1>
        <div className="pouch">
          {(['food', 'toy', 'coin'] as const).map((kind) => (
            <span className="pouch__item" key={kind}>
              <span aria-hidden="true">{REWARD_META[kind].icon}</span>
              {inventory[kind]}
            </span>
          ))}
        </div>
      </header>

      <div className="spacer" />

      <Cati
        mood={line.mood}
        size={230}
        onPoke={() => setLine(lineFor('poke'))}
      />
      <SpeechBubble text={line.text} />

      <div className="spacer" />

      <div className="stack">
        <button className="btn btn--wide" onClick={onStartFocus}>
          Start focusing together
        </button>
        <button className="btn btn--wide btn--soft" onClick={onHangout}>
          {hasTreats ? 'Hang out with Cati' : 'Just say hi'}
        </button>
      </div>
    </div>
  )
}
