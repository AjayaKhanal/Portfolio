import React from 'react'
import { Code2 } from 'lucide-react'
import { cn } from '../lib/utils'
import { useDeveloperMode } from '../context/DeveloperModeContext'
import '../styles/devmode.css'

/**
 * DevModeToggle — a switch that turns developer mode on/off.
 * When on, the Components gallery and Editor become visible and reachable.
 */
const DevModeToggle = React.forwardRef(({ className, ...rest }, ref) => {
  const { devMode, toggleDevMode } = useDeveloperMode()

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={devMode}
      aria-label="Toggle developer mode"
      title={devMode ? 'Developer mode is on' : 'Developer mode is off'}
      onClick={toggleDevMode}
      className={cn('devmode-toggle', devMode && 'is-on', className)}
      {...rest}
    >
      <Code2 size={14} aria-hidden="true" />
      <span className="devmode-label">Developer Mode</span>
      <span className="devmode-switch" aria-hidden="true">
        <span className="devmode-knob" />
      </span>
    </button>
  )
})

DevModeToggle.displayName = 'DevModeToggle'

export default DevModeToggle
