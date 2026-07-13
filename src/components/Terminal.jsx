import React, { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '../lib/utils'
import '../styles/terminal.css'

// A little ASCII box banner around the given text.
const makeBanner = (text) => {
  const label = ` ${text} `
  const bar = '─'.repeat(label.length)
  return [`┌${bar}┐`, `│${label}│`, `└${bar}┘`]
}

// Build the command set from a resolved profile so the terminal stays reusable.
// Each command's run receives (args, ctx) — most ignore them.
const buildCommands = (p) => ({
  help: {
    description: 'List all available commands',
    run: () => ({ type: 'help' }),
  },
  whoami: {
    description: 'Show name and current role',
    run: () => ({
      type: 'lines',
      lines: [
        { text: p.name, className: 'term-out--accent' },
        { text: `// ${p.role}`, className: 'term-out--muted' },
      ],
    }),
  },
  about: {
    description: 'A short introduction',
    run: () => ({
      type: 'lines',
      lines: [{ text: p.about, className: 'term-out--plain' }],
    }),
  },
  skills: {
    description: 'List technologies and tools',
    run: () => ({ type: 'chips', chips: p.skills }),
  },
  location: {
    description: 'Where I am based',
    run: () => ({
      type: 'lines',
      lines: [{ text: p.location, className: 'term-out--accent' }],
    }),
  },
  socials: {
    description: 'Show social and contact links',
    run: () => ({ type: 'links', links: p.links }),
  },
  echo: {
    description: 'Print the given text',
    run: (args) => ({
      type: 'lines',
      lines: [{ text: args.join(' '), className: 'term-out--plain' }],
    }),
  },
  date: {
    description: 'Show the current date and time',
    run: () => ({
      type: 'lines',
      lines: [{ text: new Date().toString(), className: 'term-out--accent' }],
    }),
  },
  history: {
    description: 'Show previously run commands',
    run: (args, ctx) => ({
      type: 'lines',
      lines: ctx.pastCommands.length
        ? ctx.pastCommands.map((c, i) => ({
            text: `${i + 1}  ${c}`,
            className: 'term-out--muted',
          }))
        : [{ text: 'No history yet.', className: 'term-out--muted' }],
    }),
  },
  banner: {
    description: 'Print a name banner',
    run: () => ({ type: 'banner', lines: makeBanner(p.name) }),
  },
  clear: {
    description: 'Clear the terminal screen',
    run: () => ({ type: 'clear' }),
  },
})

// The terminal is presentational — the caller passes a `profile` object with
// the data it should display: { user, path, shell, name, role, location,
// about, skills, links }.
const Terminal = React.forwardRef(({ profile = {}, className, ...rest }, ref) => {
  const p = profile
  const COMMANDS = useMemo(() => buildCommands(p), [p])
  const WELCOME = useMemo(
    () => ({
      type: 'lines',
      lines: [
        { text: `Welcome to ${p.name}'s terminal.`, className: 'term-out--accent' },
        { text: "Type 'help' and press Enter to see what you can do.", className: 'term-out--muted' },
        { text: 'Tip: Tab autocompletes · ↑/↓ recalls history · Ctrl+L clears.', className: 'term-out--muted' },
      ],
    }),
    [p]
  )

  const [history, setHistory] = useState([{ command: null, result: WELCOME }])
  const [input, setInput] = useState('')
  const [pastCommands, setPastCommands] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const bodyRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [history])

  const focusInput = () => {
    if (inputRef.current) inputRef.current.focus()
  }

  const runCommand = (raw) => {
    const trimmed = raw.trim()
    const parts = trimmed.split(/\s+/)
    const name = (parts[0] || '').toLowerCase()
    const args = parts.slice(1)

    if (trimmed === '') {
      setHistory((h) => [...h, { command: '', result: null }])
      return
    }

    setPastCommands((c) => [...c, trimmed])

    const command = COMMANDS[name]

    if (!command) {
      setHistory((h) => [
        ...h,
        {
          command: trimmed,
          result: {
            type: 'lines',
            lines: [
              {
                text: `command not found: ${name} — type 'help' for a list.`,
                className: 'term-out--error',
              },
            ],
          },
        },
      ])
      return
    }

    // `pastCommands` here is the value before this command was appended, so the
    // `history` command lists everything up to (but not including) itself.
    const result = command.run(args, { pastCommands, profile: p })

    if (result.type === 'clear') {
      setHistory([])
      return
    }

    setHistory((h) => [...h, { command: trimmed, result }])
  }

  const onKeyDown = (e) => {
    // Ctrl/Cmd+L clears the screen, like a real shell.
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
      e.preventDefault()
      setHistory([])
      return
    }
    // Ctrl+C abandons the current line.
    if (e.ctrlKey && e.key.toLowerCase() === 'c') {
      e.preventDefault()
      setHistory((h) => [...h, { command: `${input}^C`, result: null }])
      setInput('')
      setHistoryIndex(-1)
      return
    }

    if (e.key === 'Enter') {
      runCommand(input)
      setInput('')
      setHistoryIndex(-1)
    } else if (e.key === 'Tab') {
      // Autocomplete the command from the available set.
      e.preventDefault()
      const typed = input.trim().toLowerCase()
      if (!typed) return
      const matches = Object.keys(COMMANDS).filter((c) => c.startsWith(typed))
      if (matches.length === 1) {
        setInput(matches[0])
      } else if (matches.length > 1) {
        setHistory((h) => [
          ...h,
          { command: null, result: { type: 'lines', lines: [{ text: matches.join('   '), className: 'term-out--muted' }] } },
        ])
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (pastCommands.length === 0) return
      const nextIndex =
        historyIndex === -1 ? pastCommands.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(nextIndex)
      setInput(pastCommands[nextIndex])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex === -1) return
      const nextIndex = historyIndex + 1
      if (nextIndex >= pastCommands.length) {
        setHistoryIndex(-1)
        setInput('')
      } else {
        setHistoryIndex(nextIndex)
        setInput(pastCommands[nextIndex])
      }
    }
  }

  const renderPrompt = () => (
    <span className="term-prompt">
      <span className="term-prompt-user">{p.user}</span>
      <span className="term-prompt-sep">:</span>
      <span className="term-prompt-path">{p.path}</span>
      <span className="term-prompt-symbol">$</span>
    </span>
  )

  const renderResult = (result) => {
    if (!result) return null

    if (result.type === 'help') {
      return (
        <div className="term-help">
          {Object.entries(COMMANDS).map(([name, { description }]) => (
            <div key={name} className="term-help-row">
              <span className="term-help-cmd">{name}</span>
              <span className="term-help-desc">{description}</span>
            </div>
          ))}
        </div>
      )
    }

    if (result.type === 'chips') {
      return (
        <div className="term-chips">
          {result.chips.map((chip) => (
            <span key={chip} className="term-chip">
              {chip}
            </span>
          ))}
        </div>
      )
    }

    if (result.type === 'links') {
      return (
        <div className="term-links">
          {result.links.map((link) => (
            <a
              key={link.label}
              className="term-link"
              href={link.href}
              target={link.href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          ))}
        </div>
      )
    }

    if (result.type === 'banner') {
      return <pre className="term-banner">{result.lines.join('\n')}</pre>
    }

    if (result.type === 'lines') {
      return result.lines.map((part, i) => (
        <div key={i} className={`term-out ${part.className || ''}`}>
          {part.text}
        </div>
      ))
    }

    return null
  }

  return (
    <div
      ref={ref}
      className={cn('terminal', className)}
      onClick={focusInput}
      role="group"
      aria-label={`Interactive terminal for ${p.name}`}
      {...rest}
    >
      <div className="terminal-bar">
        <div className="terminal-dots" aria-hidden="true">
          <span className="terminal-dot terminal-dot--red" />
          <span className="terminal-dot terminal-dot--amber" />
          <span className="terminal-dot terminal-dot--green" />
        </div>
        <span className="terminal-title">
          {p.user}: {p.path}
        </span>
        <span className="terminal-shell" aria-hidden="true">
          {p.shell}
        </span>
      </div>

      <div className="terminal-body" ref={bodyRef}>
        {history.map((entry, i) => (
          <div key={i} className="term-line">
            {entry.command !== null && (
              <div className="term-command">
                {renderPrompt()}
                <span className="term-cmd-text">{entry.command}</span>
              </div>
            )}
            {renderResult(entry.result)}
          </div>
        ))}

        <div className="term-command term-input-line">
          {renderPrompt()}
          <input
            ref={inputRef}
            className="term-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck="false"
            autoComplete="off"
            autoCapitalize="off"
            aria-label="Type a command"
            placeholder="type 'help'"
          />
        </div>
      </div>
    </div>
  )
})

Terminal.displayName = 'Terminal'

export default Terminal
