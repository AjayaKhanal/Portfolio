import React, { useEffect, useRef, useState } from 'react'
import { Eye, Terminal, RotateCw, ExternalLink, X } from 'lucide-react'

/*
 * RunPanel — renders the output of the "Run" action.
 * - 'preview' mode (HTML): shows the live page in a sandboxed iframe, with a
 *   Console tab for any console.* / errors it emits.
 * - 'console' mode (JS): the iframe runs hidden; only the Console is shown.
 * The iframe is sandboxed (allow-scripts, no same-origin) so user code can't
 * touch the host page; logs are streamed back via postMessage.
 */
const RunPanel = ({ run, onClose, onRerun }) => {
  const [tab, setTab] = useState(run.mode)
  const [logs, setLogs] = useState([])
  const iframeRef = useRef(null)

  // Reset the view + console each time a new run starts.
  useEffect(() => {
    setTab(run.mode)
    setLogs([])
  }, [run.id, run.mode])

  // Collect console output from the sandboxed iframe.
  useEffect(() => {
    const onMessage = (e) => {
      const data = e.data
      if (data && data.__editorRun) {
        setLogs((prev) => [...prev, { type: data.type, text: data.text }])
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  const showConsole = tab === 'console' || run.mode === 'console'

  // Open the program output in a real browser tab (full page, no sandbox),
  // then close the in-editor output panel.
  const openInNewTab = () => {
    if (!run.doc) return
    const blob = new Blob([run.doc], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank', 'noopener')
    // Give the new tab time to load before releasing the URL.
    setTimeout(() => URL.revokeObjectURL(url), 60000)
    onClose()
  }

  return (
    <section className="run-panel">
      <div className="run-head">
        <div className="run-tabs">
          {run.mode === 'preview' && (
            <button
              type="button"
              className={`run-tab${tab === 'preview' ? ' is-active' : ''}`}
              onClick={() => setTab('preview')}
            >
              <Eye size={14} aria-hidden="true" />
              Preview
            </button>
          )}
          <button
            type="button"
            className={`run-tab${tab === 'console' ? ' is-active' : ''}`}
            onClick={() => setTab('console')}
          >
            <Terminal size={14} aria-hidden="true" />
            Console
            {logs.length > 0 && <span className="run-badge">{logs.length}</span>}
          </button>
        </div>

        <div className="run-head-actions">
          {!run.note && (
            <button
              type="button"
              className="run-newtab"
              onClick={openInNewTab}
              title="Open output in a new tab"
            >
              <ExternalLink size={14} aria-hidden="true" />
              <span>Open in new tab</span>
            </button>
          )}
          <button type="button" className="run-icon-btn" onClick={onRerun} title="Re-run">
            <RotateCw size={15} aria-hidden="true" />
          </button>
          <button type="button" className="run-icon-btn" onClick={onClose} title="Close output">
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="run-body">
        {run.note ? (
          <div className="run-note">{run.note}</div>
        ) : (
          <>
            {/* Always mounted so JS executes even in console-only mode. */}
            <iframe
              key={run.id}
              ref={iframeRef}
              className="run-frame"
              title="Program output"
              sandbox="allow-scripts allow-modals"
              srcDoc={run.doc}
              style={{ display: tab === 'preview' ? 'block' : 'none' }}
            />

            {showConsole && (
              <div className="run-console" style={{ display: tab === 'console' ? 'block' : 'none' }}>
                {logs.length === 0 ? (
                  <div className="run-console-empty">No console output.</div>
                ) : (
                  logs.map((line, i) => (
                    <div key={i} className={`run-log run-log--${line.type}`}>
                      {line.text}
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default RunPanel
