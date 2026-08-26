import { useState } from 'react'
import HomeScreen from './screens/HomeScreen'
import FocusScreen from './screens/FocusScreen'
import BreakScreen from './screens/BreakScreen'
import RewardScreen from './screens/RewardScreen'
import HangoutScreen from './screens/HangoutScreen'
import FeedMe from './challenges/FeedMe'
import { useInventory } from './hooks/useInventory'
import { unlockAudio } from './audio/sfx'
import type { ChallengeId, ChallengeResult, Screen } from './types'

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [challenge, setChallenge] = useState<ChallengeId | null>(null)
  const [result, setResult] = useState<ChallengeResult | null>(null)
  /** Where "back" should land: mid-loop we return to the break, else home. */
  const [inLoop, setInLoop] = useState(false)

  const { items, earn, spend } = useInventory()

  const finishChallenge = (outcome: ChallengeResult) => {
    if (outcome.reward) earn(outcome.reward)
    setResult(outcome)
    setScreen('reward')
  }

  const leaveLoop = () => {
    setInLoop(false)
    setScreen('home')
  }

  return (
    <div className="app">
      {screen === 'home' && (
        <HomeScreen
          inventory={items}
          onStartFocus={() => {
            // Browsers only allow audio to start from a gesture — this is it.
            unlockAudio()
            setInLoop(true)
            setScreen('focus')
          }}
          onHangout={() => setScreen('hangout')}
        />
      )}

      {screen === 'focus' && (
        <FocusScreen
          onComplete={() => setScreen('break')}
          onGiveUp={leaveLoop}
        />
      )}

      {screen === 'break' && (
        <BreakScreen
          lastPlayed={challenge ?? undefined}
          onPlay={(id) => {
            setChallenge(id)
            setScreen('challenge')
          }}
          onContinue={() => setScreen('focus')}
          onStop={leaveLoop}
        />
      )}

      {screen === 'challenge' && challenge === 'feed' && (
        <FeedMe onFinish={finishChallenge} />
      )}

      {screen === 'reward' && result && (
        <RewardScreen
          result={result}
          onHangout={() => setScreen('hangout')}
          onBack={() => setScreen(inLoop ? 'break' : 'home')}
        />
      )}

      {screen === 'hangout' && (
        <HangoutScreen
          inventory={items}
          onSpend={spend}
          onBack={() => setScreen(inLoop ? 'break' : 'home')}
          backLabel={inLoop ? 'Back to break' : 'Back home'}
        />
      )}
    </div>
  )
}
