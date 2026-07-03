import React, { useState } from 'react'
import { Eye, Code2, Copy, FlaskConical, RotateCcw } from 'lucide-react'

/*
 * ComponentPreview — one demo card in the /components gallery.
 * Shows a live Preview and the Code, with Copy and (optionally) "Try it out".
 */
const ComponentPreview = ({ entry, onCopy, onTryIt }) => {
  const [tab, setTab] = useState('preview')
  // Bumping this remounts <Demo />, resetting its internal state.
  const [previewKey, setPreviewKey] = useState(0)
  const { Demo, code, source, playground } = entry
  // Prefer the component's actual source; fall back to the usage snippet.
  const codeText = source || code

  return (
    <article className="comp-card">
      <div className="comp-toolbar">
        <div className="comp-tabs">
          <button
            type="button"
            className={`comp-tab${tab === 'preview' ? ' is-active' : ''}`}
            onClick={() => setTab('preview')}
          >
            <Eye size={14} aria-hidden="true" />
            Preview
          </button>
          <button
            type="button"
            className={`comp-tab${tab === 'code' ? ' is-active' : ''}`}
            onClick={() => setTab('code')}
          >
            <Code2 size={14} aria-hidden="true" />
            Code
          </button>
        </div>

        <div className="comp-actions">
          {playground && (
            <button type="button" className="comp-action comp-action--try" onClick={() => onTryIt(entry)}>
              <FlaskConical size={14} aria-hidden="true" />
              Try it out
            </button>
          )}
          <button type="button" className="comp-action" onClick={() => onCopy(codeText)}>
            <Copy size={14} aria-hidden="true" />
            Copy
          </button>
        </div>
      </div>

      <div className="comp-body">
        {tab === 'preview' ? (
          <div className="comp-preview">
            <button
              type="button"
              className="comp-refresh"
              onClick={() => setPreviewKey((k) => k + 1)}
              title="Refresh preview"
              aria-label="Refresh preview"
            >
              {/* key remounts the icon each refresh so the spin replays. */}
              <RotateCcw key={previewKey} size={14} className="comp-refresh-icon" aria-hidden="true" />
            </button>
            {/* key remounts the stage each refresh: replays the flash animation
                (visible feedback even for static demos) and resets the demo.
                previewKey lets demos with session guards (e.g. TypingText) mint
                a fresh identity so they replay. */}
            <div className="comp-preview-stage" key={previewKey}>
              <Demo previewKey={previewKey} />
            </div>
          </div>
        ) : (
          <pre className="comp-code">
            <code>{codeText}</code>
          </pre>
        )}
      </div>
    </article>
  )
}

export default ComponentPreview
