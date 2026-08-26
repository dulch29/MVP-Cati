import { useEffect, useState } from 'react'
import './SpeechBubble.css'

interface SpeechBubbleProps {
  text: string
  /** ms per character; lower is faster. */
  speed?: number
}

/** Types Cati's line out so it reads like she is saying it, not printing it. */
export default function SpeechBubble({ text, speed = 26 }: SpeechBubbleProps) {
  const [shown, setShown] = useState('')

  useEffect(() => {
    setShown('')
    if (!text) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setShown(text)
      return
    }

    let index = 0
    const id = window.setInterval(() => {
      index += 1
      setShown(text.slice(0, index))
      if (index >= text.length) window.clearInterval(id)
    }, speed)

    return () => window.clearInterval(id)
  }, [text, speed])

  return (
    <div className="bubble" aria-live="polite">
      <p className="bubble__text">
        {shown}
        {shown.length < text.length && <span className="bubble__caret" />}
      </p>
    </div>
  )
}
