import React, { useState } from 'react'
import Game2048 from '../components/Game2048'
import Wordle from '../components/Wordle'
import TypingTest from '../components/TypingTest'
import usePageMeta from '../utils/usePageMeta'
import '../styles/games.css'

const GAMES = [
  { id: '2048', label: '2048', tagline: 'Combine tiles to reach 2048.' },
  { id: 'wordle', label: 'Wordle', tagline: 'Guess the hidden 5–7 letter word in six tries.' },
  { id: 'typing', label: 'Typing Test', tagline: 'How fast can you type? Measure your WPM.' },
]

const Games = () => {
  usePageMeta('Games', 'Take a break — play 2048, Wordle, a typing speed test and other small browser games built by Ajaya Khanal.')
  const [active, setActive] = useState('2048')
  const current = GAMES.find((g) => g.id === active)

  return (
    <div className="games-page">
      <header className="games-hero" data-reveal="up">
        <span className="games-eyebrow">Just for fun</span>
        <h1 className="games-title">Games</h1>
        <p className="games-lead">
          A little playground of browser games I built from scratch. {current.tagline}
        </p>
      </header>

      <div className="games-switch" role="tablist" aria-label="Pick a game" data-reveal="up">
        {GAMES.map((g) => (
          <button
            key={g.id}
            type="button"
            role="tab"
            aria-selected={active === g.id}
            className={`games-switch-btn${active === g.id ? ' is-active' : ''}`}
            onClick={() => setActive(g.id)}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className="games-stage" data-reveal="scale">
        {active === '2048' && <Game2048 />}
        {active === 'wordle' && <Wordle />}
        {active === 'typing' && <TypingTest />}
      </div>
    </div>
  )
}

export default Games
