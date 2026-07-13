import React, { useCallback, useEffect, useRef, useState } from 'react'
import { HelpCircle, RotateCcw, Delete, CornerDownLeft } from 'lucide-react'
import { fetchAnswer, MAX_GUESSES } from '../constants/wordle'
import '../styles/wordle.css'

const TUTORIAL_KEY = 'wordle-tutorial-seen'
const STATS_KEY = 'wordle-stats'

const KEY_ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']

// Two-pass scoring so duplicate letters resolve exactly like real Wordle:
// exact matches first, then remaining letters for "present".
const evaluate = (guess, answer) => {
  const len = answer.length
  const result = Array(len).fill('absent')
  const pool = answer.split('')
  for (let i = 0; i < len; i++) {
    if (guess[i] === pool[i]) {
      result[i] = 'correct'
      pool[i] = null
    }
  }
  for (let i = 0; i < len; i++) {
    if (result[i] === 'correct') continue
    const idx = pool.indexOf(guess[i])
    if (idx !== -1) {
      result[i] = 'present'
      pool[idx] = null
    }
  }
  return result
}

// A guess is valid if it's a real word per the free dictionary API. On any
// network error we accept it, so play never gets stuck.
const isValidWord = async (word) => {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    return res.ok
  } catch {
    return true
  }
}

const RANK = { correct: 3, present: 2, absent: 1 }
const readStats = () => {
  try {
    return JSON.parse(localStorage.getItem(STATS_KEY)) || { played: 0, wins: 0, streak: 0, max: 0 }
  } catch {
    return { played: 0, wins: 0, streak: 0, max: 0 }
  }
}

const Wordle = () => {
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(true)
  const [guesses, setGuesses] = useState([]) // [{ word, evals }]
  const [current, setCurrent] = useState('')
  const [status, setStatus] = useState('playing') // 'playing' | 'won' | 'lost'
  const [message, setMessage] = useState('')
  const [shake, setShake] = useState(false)
  const [checking, setChecking] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [stats, setStats] = useState(readStats)
  const [showTutorial, setShowTutorial] = useState(() => !localStorage.getItem(TUTORIAL_KEY))

  // The board sizes itself to the current answer; default to 5 while loading.
  const wordLength = answer.length || 5

  const stateRef = useRef()
  stateRef.current = { answer, guesses, current, status, showTutorial, checking, loading }
  const msgTimer = useRef(null)

  // Fetch the first answer on mount.
  useEffect(() => {
    let alive = true
    fetchAnswer().then((w) => {
      if (alive) {
        setAnswer(w)
        setLoading(false)
      }
    })
    return () => { alive = false }
  }, [])

  // Reveal the end-game modal only after the row's flip animation finishes.
  useEffect(() => {
    if (status === 'won' || status === 'lost') {
      const id = setTimeout(() => setShowResult(true), status === 'won' ? 1200 : 900)
      return () => clearTimeout(id)
    }
    setShowResult(false)
  }, [status])

  const flash = useCallback((text) => {
    setMessage(text)
    clearTimeout(msgTimer.current)
    if (text) msgTimer.current = setTimeout(() => setMessage(''), 1600)
  }, [])
  useEffect(() => () => clearTimeout(msgTimer.current), [])

  const dismissTutorial = useCallback(() => {
    setShowTutorial(false)
    localStorage.setItem(TUTORIAL_KEY, '1')
  }, [])

  // Per-letter keyboard colouring, derived from every submitted guess.
  const letterStates = {}
  guesses.forEach(({ word, evals }) => {
    word.split('').forEach((ch, i) => {
      if (!letterStates[ch] || RANK[evals[i]] > RANK[letterStates[ch]]) letterStates[ch] = evals[i]
    })
  })

  const finish = useCallback((won) => {
    setStats((prev) => {
      const next = {
        played: prev.played + 1,
        wins: prev.wins + (won ? 1 : 0),
        streak: won ? prev.streak + 1 : 0,
        max: won ? Math.max(prev.max, prev.streak + 1) : prev.max,
      }
      localStorage.setItem(STATS_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const submit = useCallback(async () => {
    const { current, answer, guesses, checking, loading } = stateRef.current
    if (checking || loading) return
    if (current.length < answer.length) {
      flash('Not enough letters')
      setShake(true)
      return
    }

    // Validate against a real dictionary (may hit the network).
    setChecking(true)
    clearTimeout(msgTimer.current)
    setMessage('Checking…')
    const valid = await isValidWord(current)
    setChecking(false)
    if (!valid) {
      flash('Not a valid word')
      setShake(true)
      return
    }
    setMessage('')

    const evals = evaluate(current, answer)
    const nextGuesses = [...guesses, { word: current, evals }]
    setGuesses(nextGuesses)
    setCurrent('')

    if (current === answer) {
      setStatus('won')
      finish(true)
    } else if (nextGuesses.length >= MAX_GUESSES) {
      setStatus('lost')
      finish(false)
    }
  }, [flash, finish])

  const handleKey = useCallback(
    (key) => {
      const s = stateRef.current
      if (s.showTutorial || s.status !== 'playing' || s.checking || s.loading) return
      if (key === 'enter') return submit()
      if (key === 'back') return setCurrent((c) => c.slice(0, -1))
      if (/^[a-z]$/.test(key)) setCurrent((c) => (c.length < s.answer.length ? c + key : c))
    },
    [submit]
  )

  // Physical keyboard.
  useEffect(() => {
    const onKey = (e) => {
      if (stateRef.current.showTutorial) {
        if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') {
          e.preventDefault()
          dismissTutorial()
        }
        return
      }
      if (e.key === 'Enter') handleKey('enter')
      else if (e.key === 'Backspace') handleKey('back')
      else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toLowerCase())
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleKey, dismissTutorial])

  const restart = () => {
    setLoading(true)
    setAnswer('')
    setGuesses([])
    setCurrent('')
    setStatus('playing')
    setShowResult(false)
    flash('')
    fetchAnswer().then((w) => {
      setAnswer(w)
      setLoading(false)
    })
  }

  // Build the 6 display rows.
  const rows = []
  for (let r = 0; r < MAX_GUESSES; r++) {
    if (r < guesses.length) rows.push({ type: 'done', ...guesses[r] })
    else if (r === guesses.length) rows.push({ type: 'current', word: current })
    else rows.push({ type: 'empty', word: '' })
  }

  return (
    <div className="wordle">
      <div className="wordle-hud">
        <div className="wordle-stats">
          <div className="wordle-stat">
            <span className="wordle-stat-label">Streak</span>
            <span className="wordle-stat-value">{stats.streak}</span>
          </div>
          <div className="wordle-stat">
            <span className="wordle-stat-label">Best</span>
            <span className="wordle-stat-value">{stats.max}</span>
          </div>
        </div>
        <div className="wordle-hud-actions">
          <button
            type="button"
            className="wordle-btn wordle-btn--icon"
            onClick={() => setShowTutorial(true)}
            title="How to play"
            aria-label="How to play"
          >
            <HelpCircle size={16} aria-hidden="true" />
          </button>
          <button type="button" className="wordle-btn" onClick={restart}>
            <RotateCcw size={16} aria-hidden="true" />
            New Game
          </button>
        </div>
      </div>

      {/* --cols drives the board width so tiles keep a constant size (see CSS). */}
      <div className="wordle-board" aria-label="Wordle board" style={{ '--cols': wordLength }}>
        {loading ? (
          // Neutral fixed-size skeleton so the board doesn't "pop" from 5→6/7
          // columns once the fetched answer resolves.
          <>
            {Array.from({ length: MAX_GUESSES }).map((_, r) => (
              <div
                className="wordle-row wordle-row--skeleton"
                key={r}
                style={{ gridTemplateColumns: `repeat(${wordLength}, 1fr)` }}
              >
                {Array.from({ length: wordLength }).map((_, c) => (
                  <div className="wordle-tile wordle-tile--empty" key={c} />
                ))}
              </div>
            ))}
            {!showTutorial && (
              <div className="wordle-loading" role="status">
                <span className="wordle-loading-spinner" aria-hidden="true" />
                Loading word…
              </div>
            )}
          </>
        ) : (
          rows.map((row, r) => (
            <div
              className={`wordle-row${shake && row.type === 'current' ? ' is-shake' : ''}`}
              key={r}
              style={{ gridTemplateColumns: `repeat(${wordLength}, 1fr)` }}
              onAnimationEnd={() => shake && setShake(false)}
            >
              {Array.from({ length: wordLength }).map((_, c) => {
                const ch = row.word[c] || ''
                const state = row.type === 'done' ? row.evals[c] : ch ? 'filled' : 'empty'
                return (
                  <div
                    className={`wordle-tile wordle-tile--${state}`}
                    data-row={row.type}
                    key={row.type === 'current' ? `${c}-${ch}` : c}
                    style={row.type === 'done' ? { animationDelay: `${c * 0.12}s` } : undefined}
                  >
                    {ch}
                  </div>
                )
              })}
            </div>
          ))
        )}

        {message && <div className="wordle-message">{message}</div>}

        {showTutorial && (
          <div className="wordle-overlay wordle-tutorial">
            <p className="wordle-overlay-title">How to play</p>
            <p className="wordle-tut-intro">
              Guess the <strong>hidden word</strong> (5–7 letters) in {MAX_GUESSES} tries. After each guess the
              tiles reveal how close you were:
            </p>
            <ul className="wordle-legend">
              <li>
                <span className="wordle-tile wordle-tile--correct wordle-legend-tile">A</span>
                Right letter, right spot.
              </li>
              <li>
                <span className="wordle-tile wordle-tile--present wordle-legend-tile">B</span>
                In the word, wrong spot.
              </li>
              <li>
                <span className="wordle-tile wordle-tile--absent wordle-legend-tile">C</span>
                Not in the word.
              </li>
            </ul>
            <button type="button" className="wordle-btn wordle-btn--primary" onClick={dismissTutorial}>
              Got it — let’s play
            </button>
          </div>
        )}

        {showResult && !showTutorial && (
          <div className="wordle-overlay wordle-result">
            <p className="wordle-result-emoji" aria-hidden="true">
              {status === 'won' ? '🎉' : '😔'}
            </p>
            <p className="wordle-overlay-title">
              {status === 'won' ? 'You got it!' : 'Out of guesses'}
            </p>
            <p className="wordle-result-text">
              {status === 'won' ? (
                <>
                  Solved in <strong>{guesses.length}</strong> {guesses.length === 1 ? 'try' : 'tries'}.
                </>
              ) : (
                'Better luck next time.'
              )}
            </p>
            <p className="wordle-result-word-line">
              The word was <strong className="wordle-result-word">{answer.toUpperCase()}</strong>
            </p>
            <button type="button" className="wordle-btn wordle-btn--primary" onClick={restart}>
              <RotateCcw size={16} aria-hidden="true" />
              Retry
            </button>
          </div>
        )}
      </div>

      {/* On-screen keyboard (also drives touch play). */}
      <div className="wordle-keyboard" aria-hidden="false">
        {KEY_ROWS.map((rowKeys, i) => (
          <div className="wordle-krow" key={i}>
            {i === 2 && (
              <button
                type="button"
                className="wordle-key wordle-key--wide"
                onClick={() => handleKey('enter')}
                aria-label="Enter"
              >
                <CornerDownLeft size={16} aria-hidden="true" />
              </button>
            )}
            {rowKeys.split('').map((k) => (
              <button
                type="button"
                key={k}
                className={`wordle-key wordle-key--${letterStates[k] || 'idle'}`}
                onClick={() => handleKey(k)}
              >
                {k}
              </button>
            ))}
            {i === 2 && (
              <button
                type="button"
                className="wordle-key wordle-key--wide"
                onClick={() => handleKey('back')}
                aria-label="Backspace"
              >
                <Delete size={16} aria-hidden="true" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Wordle
