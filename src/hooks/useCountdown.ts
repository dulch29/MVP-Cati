import { useCallback, useEffect, useRef, useState } from 'react'

interface UseCountdownOptions {
  /** Total length in seconds. */
  seconds: number
  onComplete: () => void
  /** Start ticking as soon as it mounts. */
  autoStart?: boolean
}

/**
 * Counts down from wall-clock timestamps rather than accumulating interval
 * ticks, so backgrounding the tab or locking the phone does not lose time.
 */
export function useCountdown({
  seconds,
  onComplete,
  autoStart = false,
}: UseCountdownOptions) {
  const [remaining, setRemaining] = useState(seconds)
  const [running, setRunning] = useState(autoStart)

  /** Wall-clock ms when the countdown should hit zero. */
  const endAt = useRef<number | null>(null)
  const done = useRef(false)

  // Keep the callback fresh without restarting the interval.
  const completeRef = useRef(onComplete)
  useEffect(() => {
    completeRef.current = onComplete
  }, [onComplete])

  const start = useCallback(() => {
    if (done.current) return
    endAt.current = Date.now() + remaining * 1000
    setRunning(true)
  }, [remaining])

  const pause = useCallback(() => {
    if (endAt.current !== null) {
      setRemaining(Math.max(0, Math.round((endAt.current - Date.now()) / 1000)))
    }
    endAt.current = null
    setRunning(false)
  }, [])

  const reset = useCallback(() => {
    endAt.current = null
    done.current = false
    setRunning(false)
    setRemaining(seconds)
  }, [seconds])

  // Autostart once on mount, using the initial length.
  useEffect(() => {
    if (!autoStart) return
    endAt.current = Date.now() + seconds * 1000
    setRunning(true)
  }, [autoStart, seconds])

  useEffect(() => {
    if (!running) return

    const tick = () => {
      if (endAt.current === null) return
      const left = Math.max(0, Math.round((endAt.current - Date.now()) / 1000))
      setRemaining(left)

      if (left <= 0 && !done.current) {
        done.current = true
        endAt.current = null
        setRunning(false)
        completeRef.current()
      }
    }

    const id = window.setInterval(tick, 250)
    // Re-sync the moment we come back to a backgrounded tab.
    document.addEventListener('visibilitychange', tick)

    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [running])

  /** Dev/demo helper: jump near the end instead of waiting 25 minutes. */
  const skipToEnd = useCallback(() => {
    endAt.current = Date.now() + 1200
    setRunning(true)
  }, [])

  const progress = seconds > 0 ? 1 - remaining / seconds : 0

  return { remaining, running, progress, start, pause, reset, skipToEnd }
}

export function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
