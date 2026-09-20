import type { Mood } from '../types'

/** Every moment in the loop where Cati has something to say. */
export type CatiEvent =
  | 'greet'
  | 'startWork'
  | 'midWork'
  | 'finishWork'
  | 'startBreak'
  | 'pickChallenge'
  | 'challengeWin'
  | 'challengeLose'
  | 'reward'
  | 'hangout'
  | 'fed'
  | 'played'
  | 'continue'
  | 'goodbye'
  /** Tapped on. */
  | 'poke'
  /** Tapped on mid-session, when she's supposed to be keeping you honest. */
  | 'pokeWorking'

export interface Line {
  text: string
  mood: Mood
}

/**
 * Cati's voice: playful and teasing by default, warm underneath, and genuinely
 * serious when you are actually working. Multiple lines per event so she does
 * not repeat herself across a session.
 */
const SCRIPT: Record<CatiEvent, Line[]> = {
  greet: [
    { text: "Oh, you're here! I was pretending to nap.", mood: 'happy' },
    { text: 'Back again? Good. I get bored alone.', mood: 'idle' },
    { text: "Hi. I saved you the warm spot. Let's work.", mood: 'happy' },
  ],
  startWork: [
    { text: "Alright, 25 minutes. I'm watching you.", mood: 'serious' },
    { text: "No scrolling. I'll know... Cats always know.", mood: 'serious' },
    { text: "Let's go! I'll sit right here the whole time!", mood: 'focused' },
  ],
  midWork: [
    { text: 'Still going? Nice.', mood: 'focused' },
    { text: "Halfway. Don't look at me, look at your work.", mood: 'focused' },
  ],
  finishWork: [
    { text: 'MEOW! Time! You actually did it!', mood: 'happy' },
    { text: "That's 25 minutes. I'm a little impressed. MEOW!", mood: 'happy' },
    { text: "Done! Okay, my turn now. Break time.", mood: 'happy' },
  ],
  startBreak: [
    { text: 'Five minutes. Stretchhhh, then come play.', mood: 'idle' },
    { text: 'Break! Pick something fun for us.', mood: 'happy' },
  ],
  pickChallenge: [
    { text: 'So? What are we doing?', mood: 'idle' },
    { text: 'Choose. I promise to behave. Mostly.', mood: 'teasing' },
  ],
  challengeWin: [
    { text: 'Okay okay, you win. This time.', mood: 'happy' },
    { text: 'You got me! Purrfect.', mood: 'happy' },
    { text: "Fine, you're good at this. Don't get smug.", mood: 'teasing' },
  ],
  challengeLose: [
    { text: 'Too slow! Hehe.', mood: 'teasing' },
    { text: 'I win. Obviously. I am a cat.', mood: 'teasing' },
    { text: "Aww, so close. Not really. But close.", mood: 'teasing' },
  ],
  reward: [
    { text: 'Ooh, is that for me?', mood: 'hungry' },
    { text: 'Treats! You know the way to my heart.', mood: 'happy' },
  ],
  hangout: [
    { text: 'Pet me. Or feed me. Your choice, obviously feed me.', mood: 'idle' },
    { text: "Look at us, hanging out. Don't tell anyone I like it.", mood: 'happy' },
  ],
  fed: [
    { text: 'Nom nom nom... okay you can stay.', mood: 'happy' },
    { text: 'Mmm. Best human.', mood: 'happy' },
  ],
  played: [
    { text: 'AGAIN! Throw it AGAIN!', mood: 'happy' },
    { text: 'Got it! Did you see that? Did you SEE?', mood: 'happy' },
  ],
  continue: [
    { text: "Round two? I like your energy.", mood: 'focused' },
    { text: 'Back to work. I believe in you, mostly.', mood: 'serious' },
  ],
  goodbye: [
    { text: 'Leaving? Rude. Fine. Come back soon.', mood: 'teasing' },
    { text: 'Good work today. Go rest, human.', mood: 'happy' },
  ],
  poke: [
    { text: 'Mrrp!', mood: 'happy' },
    { text: 'Boop. Do it again.', mood: 'happy' },
    { text: 'Hey! ...okay, that was nice.', mood: 'surprised' },
    { text: 'Purrrr.', mood: 'happy' },
    { text: 'You keep poking me. I allow it.', mood: 'teasing' },
    { text: 'Careful, I bite. Gently. Sometimes.', mood: 'teasing' },
  ],
  pokeWorking: [
    { text: 'Not now, I’m supervising.', mood: 'serious' },
    { text: 'Eyes on your work, not on me.', mood: 'serious' },
    { text: 'I felt that. Back to it.', mood: 'focused' },
    { text: 'Later. We have a timer running.', mood: 'focused' },
  ],
}

/**
 * Picks a line for an event, avoiding the one just used so repeated events feel
 * alive. Deterministic per call site via the rotating index below.
 */
const lastUsed = new Map<CatiEvent, number>()

export function lineFor(event: CatiEvent): Line {
  const options = SCRIPT[event]
  if (options.length === 1) return options[0]

  const previous = lastUsed.get(event)
  let index = Math.floor(Math.random() * options.length)
  if (index === previous) index = (index + 1) % options.length
  lastUsed.set(event, index)
  return options[index]
}
