import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

// Developer mode gates the "builder"-facing pages (Components gallery + Editor).
// When off, those pages are hidden from the nav AND blocked by route guards,
// even via a direct URL. The choice is persisted to localStorage.

const STORAGE_KEY = 'devMode'

const DeveloperModeContext = createContext({
  devMode: false,
  toggleDevMode: () => {},
  setDevMode: () => {},
})

const readStored = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function DeveloperModeProvider({ children }) {
  const [devMode, setDevMode] = useState(readStored)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(devMode))
    } catch {
      /* ignore write errors (e.g. private mode) */
    }
  }, [devMode])

  const toggleDevMode = useCallback(() => setDevMode((v) => !v), [])

  return (
    <DeveloperModeContext.Provider value={{ devMode, toggleDevMode, setDevMode }}>
      {children}
    </DeveloperModeContext.Provider>
  )
}

export function useDeveloperMode() {
  return useContext(DeveloperModeContext)
}
