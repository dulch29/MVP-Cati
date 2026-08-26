import { useEffect, useRef, useState } from 'react'
import { play } from '../audio/sfx'
import type { Mood } from '../types'
import './Cati.css'

interface CatiProps {
  mood: Mood
  /** Visual size in px. Cati stays the focal point, so default big. */
  size?: number
  /** Pass through for challenges that position her absolutely. */
  className?: string
  /**
   * Tapping her is the ambient interaction — available everywhere she appears.
   * Pass a handler to react (usually a line of dialogue); omit it and she still
   * squishes and chirps on her own.
   */
  onPoke?: () => void
  /**
   * Time to show on a clock held against her belly, e.g. `"25:00"`. Omit it and
   * she just sits — the pose only changes when there's something to hold.
   */
  clock?: string
  /** 0–1 elapsed fraction, swept around the clock's bezel. */
  progress?: number
}

/**
 * Cati, drawn as vector shapes so every mood is a CSS state rather than an
 * asset. To move to hand-drawn art later, replace the <svg> below with an
 * <img> switched on `mood` — nothing outside this file knows the difference.
 */
export default function Cati({
  mood,
  size = 210,
  className = '',
  onPoke,
  clock,
  progress,
}: CatiProps) {
  // Alternating chirp/purr so repeated taps don't sound like a stuck button.
  const pokes = useRef(0)
  const [squish, setSquish] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(() => () => window.clearTimeout(timer.current ?? undefined), [])

  const poke = () => {
    pokes.current += 1
    play(pokes.current % 3 === 0 ? 'purr' : 'mrrp')

    // Restart the squish even mid-animation: drop the class, then re-add it.
    setSquish(false)
    window.clearTimeout(timer.current ?? undefined)
    requestAnimationFrame(() => setSquish(true))
    timer.current = window.setTimeout(() => setSquish(false), 420)

    onPoke?.()
  }

  const holding = clock !== undefined
  const dial = 35.5
  const circumference = 2 * Math.PI * dial
  const clamped = Math.min(1, Math.max(0, progress ?? 0))

  const classes = [
    'cati',
    `cati--${mood}`,
    holding && 'cati--holding',
    squish && 'is-poked',
    onPoke && 'cati--pokable',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={classes}
      style={{ width: size, height: size }}
      onPointerDown={onPoke ? poke : undefined}
      onKeyDown={
        onPoke
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                poke()
              }
            }
          : undefined
      }
      role={onPoke ? 'button' : 'img'}
      tabIndex={onPoke ? 0 : undefined}
      aria-label={onPoke ? 'Pet Cati' : `Cati looking ${mood}`}
    >
      <svg viewBox="0 0 200 200" className="cati__svg">
        <ellipse className="cati__shadow" cx="100" cy="181" rx="52" ry="8" />

        <g className="cati__tail-shift">
          <g className="cati__tail-group">
            <path
              className="cati__tail"
              d="M143 150 q34 6 30-26 q-3-22-22-18"
              fill="none"
              strokeWidth="13"
              strokeLinecap="round"
            />
          </g>
        </g>

        <g className="cati__body-group">
          {/* body: the plain sitting shape, or a taller torso when holding */}
          <path
            className="cati__fur cati__body cati__body--plain"
            d="M62 176 q-10-42 8-62 h60 q18 20 8 62 z"
          />
          <path
            className="cati__fur cati__body cati__body--hold"
            d="M52 190 q-8-48 10-74 h76 q18 26 10 74 z"
          />

          <g className="cati__head-group">
            {/* ears */}
            <path className="cati__fur cati__ear" d="M56 92 L52 52 L88 74 z" />
            <path className="cati__fur cati__ear" d="M144 92 L148 52 L112 74 z" />
            <path className="cati__ear-inner" d="M62 84 L60 63 L80 74 z" />
            <path className="cati__ear-inner" d="M138 84 L140 63 L120 74 z" />

            {/* head */}
            <ellipse className="cati__fur" cx="100" cy="106" rx="49" ry="43" />

            {/* eyes */}
            <g className="cati__eyes">
              <g className="cati__eye cati__eye--l">
                <ellipse className="cati__eye-open" cx="82" cy="103" rx="7.5" ry="9" />
                <circle className="cati__eye-shine" cx="84.5" cy="100" r="2.6" />
              </g>
              <g className="cati__eye cati__eye--r">
                <ellipse className="cati__eye-open" cx="118" cy="103" rx="7.5" ry="9" />
                <circle className="cati__eye-shine" cx="120.5" cy="100" r="2.6" />
              </g>
              {/* closed / sleeping lids, revealed by mood */}
              <path
                className="cati__lid"
                d="M74 104 q8 7 16 0"
                fill="none"
                strokeWidth="3.4"
                strokeLinecap="round"
              />
              <path
                className="cati__lid"
                d="M110 104 q8 7 16 0"
                fill="none"
                strokeWidth="3.4"
                strokeLinecap="round"
              />
            </g>

            {/* blush */}
            <ellipse className="cati__blush" cx="68" cy="118" rx="9" ry="5.5" />
            <ellipse className="cati__blush" cx="132" cy="118" rx="9" ry="5.5" />

            {/* nose + mouth */}
            <path className="cati__nose" d="M96 116 h8 l-4 4.5 z" />
            <path
              className="cati__mouth"
              d="M91 124 q9 7 18 0"
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* whiskers */}
            <g className="cati__whiskers" strokeWidth="2.4" strokeLinecap="round">
              <path d="M52 112 h16" />
              <path d="M53 122 h15" />
              <path d="M148 112 h-16" />
              <path d="M147 122 h-15" />
            </g>
          </g>

          {/* front paws, tucked in when she's sitting */}
          <ellipse
            className="cati__paw cati__paw--plain"
            cx="80"
            cy="174"
            rx="12"
            ry="7"
          />
          <ellipse
            className="cati__paw cati__paw--plain"
            cx="120"
            cy="174"
            rx="12"
            ry="7"
          />

          {holding && (
            <g className="cati__clock">
              {/* rim, then dial, so the rim reads as a thick white bezel */}
              <circle className="cati__clock-rim" cx="100" cy="148" r="40" />
              <circle className="cati__clock-face" cx="100" cy="148" r="31" />

              {/* elapsed sweep, drawn on the bezel like the reference */}
              <circle
                className="cati__clock-track"
                cx="100"
                cy="148"
                r={dial}
                fill="none"
              />
              <circle
                className="cati__clock-fill"
                cx="100"
                cy="148"
                r={dial}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - clamped)}
              />

              {/* the nub at twelve o'clock */}
              <rect
                className="cati__clock-nub"
                x="98.5"
                y="106"
                width="3"
                height="7"
                rx="1.5"
              />

              <text className="cati__clock-text" x="100" y="148">
                {clock}
              </text>
            </g>
          )}

          {/* paws draped over the clock, plus back feet at the base */}
          {holding && (
            <g className="cati__hold">
              <ellipse
                className="cati__paw cati__paw--hold"
                cx="69"
                cy="119"
                rx="14"
                ry="11"
              />
              <ellipse
                className="cati__paw cati__paw--hold"
                cx="131"
                cy="119"
                rx="14"
                ry="11"
              />
              <g className="cati__toes" strokeWidth="2" strokeLinecap="round">
                <path d="M65 111 v7" />
                <path d="M73 112 v6" />
                <path d="M127 111 v7" />
                <path d="M135 112 v6" />
              </g>
              <ellipse
                className="cati__paw cati__paw--foot"
                cx="74"
                cy="185"
                rx="14"
                ry="9"
              />
              <ellipse
                className="cati__paw cati__paw--foot"
                cx="126"
                cy="185"
                rx="14"
                ry="9"
              />
            </g>
          )}
        </g>

        {/* sleeping Zs */}
        <g className="cati__zzz">
          <text className="cati__z cati__z--1" x="146" y="62">
            z
          </text>
          <text className="cati__z cati__z--2" x="158" y="46">
            z
          </text>
        </g>
      </svg>
    </div>
  )
}
