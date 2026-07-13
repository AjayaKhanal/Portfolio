import React, { useCallback, useEffect, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { generateText, DURATIONS } from '../constants/typing'
import '../styles/typing-test.css'

const BEST_KEY = 'typing-best'
const WORD_COUNT = 70

const TypingTest = () => {
  const [duration, setDuration] = useState(30)
  const [text, setText] = useState(() => generateText(WORD_COUNT))
  const [typed, setTyped] = useState('')
  const [startedAt, setStartedAt] = useState(null)
  const [finished, setFinished] = useState(false)
  const [focused, setFocused] = useState(false)
  const [, setTick] = useState(0) // forces re-render while the timer runs
  const [best, setBest] = useState(() => Number(localStorage.getItem(BEST_KEY)) || 0)

  const inputRef = useRef(null)
  const startedRef = useRef(null)
  startedRef.current = startedAt
  const finishedAtRef = useRef(null)

  const running = startedAt !== null && !finished
  const focusInput = () => inputRef.current && inputRef.current.focus()

  const finish = useCallback(() => {
    finishedAtRef.current = Date.now()
    setFinished(true)
  }, [])

  // Countdown + auto-finish when the duration is up.
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      if ((Date.now() - startedRef.current) / 1000 >= duration) finish()
      else setTick((t) => t + 1)
    }, 100)
    return () => clearInterval(id)
  }, [running, duration, finish])

  // ---- Live stats ----
  const endTs = finished ? finishedAtRef.current || Date.now() : Date.now()
  const elapsedSec = startedAt ? Math.min(duration, (endTs - startedAt) / 1000) : 0
  let correct = 0
  for (let i = 0; i < typed.length; i++) if (typed[i] === text[i]) correct++
  const wpm = elapsedSec > 0 ? Math.round(correct / 5 / (elapsedSec / 60)) : 0
  const accuracy = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100
  const timeLeft = Math.max(0, Math.ceil(duration - elapsedSec))

  // Persist best WPM once a run finishes.
  useEffect(() => {
    if (!finished) return
    setBest((b) => {
      const nb = Math.max(b, wpm)
      if (nb !== b) localStorage.setItem(BEST_KEY, String(nb))
      return nb
    })
  }, [finished, wpm])

  const onChange = (e) => {
    if (finished) return
    let val = e.target.value
    if (val.length > text.length) val = val.slice(0, text.length)
    if (startedAt === null && val.length > 0) setStartedAt(Date.now())
    setTyped(val)
    if (val.length === text.length) finish()
  }

  const reset = (nextDuration = duration) => {
    setDuration(nextDuration)
    setText(generateText(WORD_COUNT))
    setTyped('')
    setStartedAt(null)
    setFinished(false)
    finishedAtRef.current = null
    setTimeout(focusInput, 0)
  }

  const charClass = (i) => {
    if (i < typed.length) return typed[i] === text[i] ? 'tw-correct' : 'tw-wrong'
    if (i === typed.length && !finished) return 'tw-current'
    return 'tw-pending'
  }

  // Render the passage word-by-word so words never break mid-line.
  const renderText = () => {
    let i = 0
    return text.split(/(\s+)/).map((part, pi) => {
      if (part === '') return null
      const isSpace = /^\s+$/.test(part)
      const spans = part.split('').map((ch) => {
        const idx = i++
        return (
          <span key={idx} className={`tw-char ${charClass(idx)}`}>
            {ch}
          </span>
        )
      })
      return (
        <span key={pi} className={isSpace ? 'tw-space' : 'tw-word'}>
          {spans}
        </span>
      )
    })
  }

  return (
    <div className="tw">
      <div className="tw-hud">
        <div className="tw-durations" role="group" aria-label="Test length">
          {DURATIONS.map((d) => (
            <button
              key={d}
              type="button"
              className={`tw-duration${duration === d ? ' is-active' : ''}`}
              onClick={() => reset(d)}
            >
              {d}s
            </button>
          ))}
        </div>
        <button type="button" className="tw-btn" onClick={() => reset()}>
          <RotateCcw size={16} aria-hidden="true" />
          Restart
        </button>
      </div>

      <div className="tw-stats">
        <div className="tw-stat">
          <span className="tw-stat-value">{timeLeft}</span>
          <span className="tw-stat-label">Seconds</span>
        </div>
        <div className="tw-stat">
          <span className="tw-stat-value">{wpm}</span>
          <span className="tw-stat-label">WPM</span>
        </div>
        <div className="tw-stat">
          <span className="tw-stat-value">{accuracy}%</span>
          <span className="tw-stat-label">Accuracy</span>
        </div>
        <div className="tw-stat">
          <span className="tw-stat-value">{best}</span>
          <span className="tw-stat-label">Best WPM</span>
        </div>
      </div>

      <div className="tw-text" onClick={focusInput}>
        {renderText()}

        {/* Transparent capture field — real text is the styled spans above. */}
        <textarea
          ref={inputRef}
          className="tw-input"
          value={typed}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={finished}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
          aria-label="Typing input"
        />

        {!focused && !startedAt && !finished && (
          <div className="tw-focushint">Click here and start typing</div>
        )}

        {finished && (
          <div className="tw-result">
            <p className="tw-result-title">Time’s up!</p>
            <p className="tw-result-wpm">
              <strong>{wpm}</strong> WPM
            </p>
            <p className="tw-result-sub">
              {accuracy}% accuracy · {correct} correct characters
              {wpm >= best && wpm > 0 ? ' · new best! 🎉' : ''}
            </p>
            <button type="button" className="tw-btn tw-btn--primary" onClick={() => reset()}>
              <RotateCcw size={16} aria-hidden="true" />
              Try again
            </button>
          </div>
        )}
      </div>

      <p className="tw-hint">
        Type the words above as fast and accurately as you can. The timer starts on your first
        keystroke.
      </p>
    </div>
  )
}

export default TypingTest
