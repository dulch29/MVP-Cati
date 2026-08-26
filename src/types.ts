/** Everything Cati's face can do. Drives both the SVG and the dialogue. */
export type Mood =
  | 'idle'
  | 'happy'
  | 'focused'
  | 'hungry'
  | 'sleepy'
  | 'teasing'
  | 'surprised'
  | 'serious'

/** Screens in the core loop. */
export type Screen =
  | 'home'
  | 'focus'
  | 'break'
  | 'challenge'
  | 'reward'
  | 'hangout'

export type ChallengeId = 'feed' | 'catch' | 'sleep' | 'freeze'

export type RewardKind = 'food' | 'toy' | 'coin'

export type Inventory = Record<RewardKind, number>

export interface Reward {
  kind: RewardKind
  amount: number
}

export interface ChallengeResult {
  won: boolean
  reward: Reward | null
}
