# Cati

A cute virtual cat companion crossed with a Pomodoro timer.

**Work → Break → Interact with Cati → Play a Challenge → Get a Reward → Continue**

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build    # typecheck + production bundle into dist/
npm run preview  # serve the built bundle
```

Open it in a phone-sized viewport — the layout is mobile-first portrait.

### Skipping the 25-minute wait

In dev, focus and break sessions are shortened so the loop is testable. See
`DEV_SECONDS` in `src/screens/FocusScreen.tsx`. Production builds always use
the real 25/5.

## What's built

- **Focus timer** — 25/5, Start / Pause / Reset, auto hand-off to the break.
  Timestamp-based, so backgrounding the app doesn't drift the clock.
- **Cati** — one `<Cati mood={...} />` component covering idle, happy, hungry,
  sleeping, teasing and serious, plus a scripted dialogue bank keyed by event.
- **Feed Me** — the first break challenge.
- **Rewards** — food, toys and coins, spendable on Cati in the hangout screen.

## Structure

```
src/
  App.tsx            screen state machine, the core loop
  types.ts           shared types
  cati/              the character: visuals, moods, dialogue, speech bubble
  challenges/        one file per break challenge
  screens/           home, focus, break, reward, hangout
  hooks/             useTimer, useInventory
  styles/            design tokens + base layout
```

## Still to build

The other three challenges: Catch Me If You Can, DON'T WAKE THE CAT, FREEZE!
Each is a self-contained file in `src/challenges/` that takes `onFinish` and
gets registered in `CHALLENGES` (`src/types.ts`) and in `App.tsx`.

## License

MIT
