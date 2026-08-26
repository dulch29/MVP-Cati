/**
 * Cati's voice, synthesized with Web Audio — no sample files to ship or load.
 *
 * A meow is mostly a pitch contour: a quick rise into an open vowel, then a
 * longer fall as the mouth closes. We fake that with one oscillator whose
 * frequency bends, a lowpass sweep standing in for the mouth, and a little
 * vibrato so it doesn't read as a synth beep.
 */

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext
  }
}

type SoundName = 'meow' | 'happy' | 'grumpy' | 'mrrp' | 'purr'

interface Voice {
  /** Pitch contour in Hz: rises from start to peak, then falls to end. */
  start: number
  peak: number
  end: number
  /** Seconds. */
  dur: number
  /** Lowpass ceiling at the vowel's most open point. */
  cutoff: number
  gain: number
  wave: OscillatorType
  /** Vibrato rate in Hz. */
  vibrato: number
  /** Vibrato depth as a fraction of peak pitch. Default 0.03 (a light waver). */
  depth?: number
}

const VOICES: Record<SoundName, Voice[]> = {
  // Session over: a full, insistent "mrrraow".
  meow: [
    {
      start: 480,
      peak: 780,
      end: 430,
      dur: 0.52,
      cutoff: 2200,
      gain: 0.5,
      wave: 'sawtooth',
      vibrato: 22,
    },
  ],
  // Won a challenge: two bright chirps, the "mrrp mrrp" a cat does when pleased.
  happy: [
    {
      start: 620,
      peak: 940,
      end: 700,
      dur: 0.16,
      cutoff: 3000,
      gain: 0.34,
      wave: 'triangle',
      vibrato: 30,
    },
    {
      start: 700,
      peak: 1080,
      end: 820,
      dur: 0.2,
      cutoff: 3400,
      gain: 0.34,
      wave: 'triangle',
      vibrato: 30,
    },
  ],
  // Tapped: one short upward chirp. Deliberately tiny — this fires a lot.
  mrrp: [
    {
      start: 540,
      peak: 880,
      end: 640,
      dur: 0.14,
      cutoff: 2800,
      gain: 0.3,
      wave: 'triangle',
      vibrato: 34,
    },
  ],
  // Tapped again: low rolling burr. Fast vibrato on a dark tone reads as a purr.
  purr: [
    {
      start: 190,
      peak: 205,
      end: 175,
      dur: 0.75,
      cutoff: 420,
      gain: 0.38,
      wave: 'sawtooth',
      vibrato: 26,
      depth: 0.16,
    },
  ],
  // Lost: low, flat, unimpressed.
  grumpy: [
    {
      start: 300,
      peak: 330,
      end: 190,
      dur: 0.6,
      cutoff: 900,
      gain: 0.42,
      wave: 'sawtooth',
      vibrato: 14,
    },
  ],
}

/** Offsets for multi-syllable sounds, so chirps land in sequence. */
const GAP = 0.06

let ctx: AudioContext | null = null
let master: GainNode | null = null

function audio(): AudioContext | null {
  if (ctx) return ctx
  const Ctor = window.AudioContext ?? window.webkitAudioContext
  if (!Ctor) return null
  ctx = new Ctor()
  master = ctx.createGain()
  master.gain.value = 0.6
  master.connect(ctx.destination)
  return ctx
}

/**
 * Browsers refuse to start audio outside a user gesture, so call this from a
 * tap (see the start-focus button) — otherwise the first meow is swallowed.
 * Safe to call repeatedly.
 */
export function unlockAudio(): void {
  const c = audio()
  if (c && c.state === 'suspended') void c.resume()
}

function speak(c: AudioContext, at: number, v: Voice): void {
  const osc = c.createOscillator()
  const mouth = c.createBiquadFilter()
  const amp = c.createGain()

  osc.type = v.wave
  mouth.type = 'lowpass'
  mouth.Q.value = 5

  osc.connect(mouth)
  mouth.connect(amp)
  amp.connect(master as GainNode)

  const open = at + v.dur * 0.25

  osc.frequency.setValueAtTime(v.start, at)
  osc.frequency.linearRampToValueAtTime(v.peak, open)
  osc.frequency.exponentialRampToValueAtTime(v.end, at + v.dur)

  mouth.frequency.setValueAtTime(v.cutoff * 0.45, at)
  mouth.frequency.linearRampToValueAtTime(v.cutoff, open)
  mouth.frequency.linearRampToValueAtTime(v.cutoff * 0.35, at + v.dur)

  const lfo = c.createOscillator()
  const depth = c.createGain()
  lfo.frequency.value = v.vibrato
  depth.gain.value = v.peak * (v.depth ?? 0.03)
  lfo.connect(depth)
  depth.connect(osc.frequency)

  amp.gain.setValueAtTime(0, at)
  amp.gain.linearRampToValueAtTime(v.gain, at + 0.04)
  amp.gain.setValueAtTime(v.gain, at + v.dur * 0.55)
  amp.gain.exponentialRampToValueAtTime(0.0001, at + v.dur)

  const stop = at + v.dur + 0.05
  osc.start(at)
  lfo.start(at)
  osc.stop(stop)
  lfo.stop(stop)
}

/** Fire and forget. Never throws — audio failing shouldn't break the loop. */
export function play(name: SoundName): void {
  try {
    const c = audio()
    if (!c) return
    if (c.state === 'suspended') void c.resume()

    let at = c.currentTime + 0.02
    for (const v of VOICES[name]) {
      speak(c, at, v)
      at += v.dur + GAP
    }
  } catch {
    // No audio device, blocked context, unsupported browser — stay silent.
  }
}
