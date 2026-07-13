import React, { useCallback, useEffect, useRef, useState } from 'react'
import { RotateCcw, HelpCircle } from 'lucide-react'
import '../styles/game2048.css'

const SIZE = 4
const START_TILES = 2
const BEST_KEY = 'game2048-best'
const TUTORIAL_KEY = 'game2048-tutorial-seen'

const emptyBoard = () => Array.from({ length: SIZE }, () => Array(SIZE).fill(0))
const cloneBoard = (b) => b.map((row) => row.slice())

const randomEmptyCell = (board) => {
  const empties = []
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) if (board[r][c] === 0) empties.push([r, c])
  }
  return empties.length ? empties[Math.floor(Math.random() * empties.length)] : null
}

// Mutates the board: drops a 2 (90%) or 4 (10%) into a random empty cell.
const addRandomTile = (board) => {
  const cell = randomEmptyCell(board)
  if (cell) board[cell[0]][cell[1]] = Math.random() < 0.9 ? 2 : 4
  return board
}

const startBoard = () => {
  const board = emptyBoard()
  for (let i = 0; i < START_TILES; i++) addRandomTile(board)
  return board
}

// Slide + merge one row to the LEFT. Each tile merges at most once per move.
const slideLeft = (row) => {
  const nums = row.filter((n) => n !== 0)
  const out = []
  let gained = 0
  for (let i = 0; i < nums.length; i++) {
    if (i < nums.length - 1 && nums[i] === nums[i + 1]) {
      const val = nums[i] * 2
      out.push(val)
      gained += val
      i++ // consume the merged partner
    } else {
      out.push(nums[i])
    }
  }
  while (out.length < SIZE) out.push(0)
  const moved = out.some((n, i) => n !== row[i])
  return { row: out, gained, moved }
}

// Transform helpers so every direction reuses slideLeft.
const reverseRows = (b) => b.map((row) => row.slice().reverse())
const transpose = (b) => b[0].map((_, c) => b.map((row) => row[c]))

// Apply a move in `dir` ('left' | 'right' | 'up' | 'down'). Pure — returns a
// new board plus the points gained and whether anything actually moved.
const move = (board, dir) => {
  let work = cloneBoard(board)
  if (dir === 'right') work = reverseRows(work)
  else if (dir === 'up') work = transpose(work)
  else if (dir === 'down') work = reverseRows(transpose(work))

  let gained = 0
  let moved = false
  work = work.map((row) => {
    const res = slideLeft(row)
    gained += res.gained
    if (res.moved) moved = true
    return res.row
  })

  if (dir === 'right') work = reverseRows(work)
  else if (dir === 'up') work = transpose(work)
  else if (dir === 'down') work = transpose(reverseRows(work))

  return { board: work, gained, moved }
}

const hasWon = (board) => board.some((row) => row.some((n) => n >= 2048))
const canMove = (board) => {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) return true
      if (c < SIZE - 1 && board[r][c] === board[r][c + 1]) return true
      if (r < SIZE - 1 && board[r][c] === board[r + 1][c]) return true
    }
  }
  return false
}

const Game2048 = () => {
  const [board, setBoard] = useState(startBoard)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(() => Number(localStorage.getItem(BEST_KEY)) || 0)
  const [status, setStatus] = useState('playing') // 'playing' | 'won' | 'lost'
  const [keepGoing, setKeepGoing] = useState(false)
  // Show the how-to-play overlay the first time this browser opens the game.
  const [showTutorial, setShowTutorial] = useState(() => !localStorage.getItem(TUTORIAL_KEY))

  // Always-current snapshot so the one-time keydown listener never goes stale.
  const stateRef = useRef()
  stateRef.current = { board, score, best, status, keepGoing, showTutorial }

  const dismissTutorial = useCallback(() => {
    setShowTutorial(false)
    localStorage.setItem(TUTORIAL_KEY, '1')
  }, [])

  const handleMove = useCallback((dir) => {
    const s = stateRef.current
    if (s.showTutorial) return
    if (s.status === 'lost') return
    if (s.status === 'won' && !s.keepGoing) return

    const { board: next, gained, moved } = move(s.board, dir)
    if (!moved) return

    addRandomTile(next)
    setBoard(next)

    const newScore = s.score + gained
    if (gained) setScore(newScore)
    if (newScore > s.best) {
      setBest(newScore)
      localStorage.setItem(BEST_KEY, String(newScore))
    }

    if (!s.keepGoing && hasWon(next)) setStatus('won')
    else if (!canMove(next)) setStatus('lost')
  }, [])

  // Keyboard: arrow keys + WASD.
  useEffect(() => {
    const map = {
      ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down',
      a: 'left', d: 'right', w: 'up', s: 'down', A: 'left', D: 'right', W: 'up', S: 'down',
    }
    const onKey = (e) => {
      // While the tutorial is open, Enter/Esc/Space dismisses it; moves are paused.
      if (stateRef.current.showTutorial) {
        if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') {
          e.preventDefault()
          dismissTutorial()
        }
        return
      }
      const dir = map[e.key]
      if (!dir) return
      e.preventDefault()
      handleMove(dir)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleMove, dismissTutorial])

  // Touch: swipe to move.
  const touchRef = useRef(null)
  const onTouchStart = (e) => {
    const t = e.touches[0]
    touchRef.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = (e) => {
    if (!touchRef.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touchRef.current.x
    const dy = t.clientY - touchRef.current.y
    const absX = Math.abs(dx)
    const absY = Math.abs(dy)
    if (Math.max(absX, absY) >= 24) {
      if (absX > absY) handleMove(dx > 0 ? 'right' : 'left')
      else handleMove(dy > 0 ? 'down' : 'up')
    }
    touchRef.current = null
  }

  const restart = () => {
    setBoard(startBoard())
    setScore(0)
    setStatus('playing')
    setKeepGoing(false)
  }

  const keepPlaying = () => {
    setKeepGoing(true)
    setStatus('playing')
  }

  return (
    <div className="g2048">
      <div className="g2048-hud">
        <div className="g2048-scores">
          <div className="g2048-score">
            <span className="g2048-score-label">Score</span>
            <span className="g2048-score-value">{score}</span>
          </div>
          <div className="g2048-score">
            <span className="g2048-score-label">Best</span>
            <span className="g2048-score-value">{best}</span>
          </div>
        </div>
        <div className="g2048-hud-actions">
          <button
            type="button"
            className="g2048-btn g2048-btn--icon"
            onClick={() => setShowTutorial(true)}
            title="How to play"
            aria-label="How to play"
          >
            <HelpCircle size={16} aria-hidden="true" />
          </button>
          <button type="button" className="g2048-btn" onClick={restart}>
            <RotateCcw size={16} aria-hidden="true" />
            New Game
          </button>
        </div>
      </div>

      <div
        className="g2048-board"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        role="grid"
        aria-label="2048 board"
      >
        {board.map((row, r) =>
          row.map((val, c) => (
            <div className="g2048-cell" key={`${r}-${c}`}>
              {val > 0 && (
                // Keyed by value so a cell that changes remounts and re-pops.
                <div key={val} className="g2048-tile" data-value={val}>
                  {val}
                </div>
              )}
            </div>
          ))
        )}

        {showTutorial && (
          <div className="g2048-overlay g2048-tutorial">
            <p className="g2048-overlay-title">How to play</p>
            <ul className="g2048-tut-list">
              <li>
                <span className="g2048-tut-icon" aria-hidden="true">🕹️</span>
                Slide all tiles with the <strong>arrow keys</strong> / <strong>WASD</strong>, or{' '}
                <strong>swipe</strong> on touch.
              </li>
              <li>
                <span className="g2048-tut-icon" aria-hidden="true">＋</span>
                Two tiles with the <strong>same number merge</strong> into one when they touch.
              </li>
              <li>
                <span className="g2048-tut-icon" aria-hidden="true">🏆</span>
                Reach the <strong>2048</strong> tile to win — then keep going for a high score!
              </li>
            </ul>
            <button
              type="button"
              className="g2048-btn g2048-btn--primary"
              onClick={dismissTutorial}
            >
              Got it — let’s play
            </button>
          </div>
        )}

        {status !== 'playing' && !showTutorial && (
          <div className={`g2048-overlay g2048-overlay--${status}`}>
            <p className="g2048-overlay-title">{status === 'won' ? 'You win! 🎉' : 'Game over'}</p>
            <div className="g2048-overlay-actions">
              {status === 'won' && (
                <button type="button" className="g2048-btn g2048-btn--primary" onClick={keepPlaying}>
                  Keep going
                </button>
              )}
              <button type="button" className="g2048-btn g2048-btn--primary" onClick={restart}>
                {status === 'won' ? 'New Game' : 'Try again'}
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="g2048-hint">
        Join the tiles to reach <strong>2048</strong>. Use the <strong>arrow keys</strong> or{' '}
        <strong>WASD</strong> — or swipe on touch.
      </p>
    </div>
  )
}

export default Game2048
