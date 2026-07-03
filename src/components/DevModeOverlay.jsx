import React, { useEffect, useRef, useState } from 'react'
import { Code2 } from 'lucide-react'
import { useDeveloperMode } from '../context/DeveloperModeContext'
import '../styles/devmode-overlay.css'

// How long the transition animation runs (keep in sync with the CSS durations).
const DURATION = 1500

/**
 * DevModeOverlay — a brief full-screen terminal/CRT flash played whenever
 * developer mode is toggled on or off. Purely decorative (pointer-events: none)
 * and mounted once near the app root.
 */
const DevModeOverlay = () => {
  const { devMode } = useDeveloperMode()
  const prev = useRef(devMode)
  const firstRun = useRef(true)
  const [phase, setPhase] = useState(null) // 'on' | 'off' | null

  useEffect(() => {
    // Skip the initial mount and persisted-value reads — only animate on change.
    if (firstRun.current) {
      firstRun.current = false
      prev.current = devMode
      return
    }
    if (prev.current === devMode) return
    prev.current = devMode

    setPhase(devMode ? 'on' : 'off')
    const id = setTimeout(() => setPhase(null), DURATION)
    return () => clearTimeout(id)
  }, [devMode])

  if (!phase) return null

  const on = phase === 'on'

  return (
    <div className={`devx-overlay devx-overlay--${phase}`} role="status" aria-live="polite">
      <div className="devx-scanlines" aria-hidden="true" />
      <div className="devx-sweep" aria-hidden="true" />

      <div className="devx-panel">
        <span className="devx-icon" aria-hidden="true">
          <Code2 size={40} strokeWidth={2.4} />
        </span>
        <p className="devx-title" data-text="DEVELOPER MODE">
          DEVELOPER MODE
        </p>
        <p className="devx-status">
          <span className="devx-prompt" aria-hidden="true">&gt;</span>
          {on ? 'ENABLED' : 'DISABLED'}
          <span className="devx-cursor" aria-hidden="true" />
        </p>
      </div>
    </div>
  )
}

export default DevModeOverlay
