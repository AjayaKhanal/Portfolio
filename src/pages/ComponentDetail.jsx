import React, { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ComponentPreview from '../components/ComponentPreview'
import SectionHeading from '../components/SectionHeading'
import Toast from '../components/Toast'
import NotFound from './NotFound'
import { COMPONENTS, COMPONENT_PROPS } from '../constants/componentsRegistry'
import { openComponentInEditor } from '../utils/editorBridge'
import usePageMeta from '../utils/usePageMeta'
import '../styles/components-page.css'

const ComponentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const entry = COMPONENTS.find((c) => c.id === id)
  const [toast, setToast] = useState(null)

  usePageMeta(entry ? `${entry.name} — Component` : 'Component', entry ? entry.description : undefined)

  if (!entry) return <NotFound />

  const props = COMPONENT_PROPS[entry.id] || []

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code)
      setToast({ type: 'success', message: 'Code copied to clipboard!' })
    } catch {
      setToast({ type: 'error', message: 'Could not copy — your browser blocked clipboard access.' })
    }
  }

  return (
    <div className="component-detail">
      <Link to="/components" className="cd-back">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to Components
      </Link>

      <header className="cd-head">
        <span className="comp-cat">{entry.category}</span>
        <h1 className="cd-title">{entry.name}</h1>
        <p className="cd-desc">{entry.description}</p>
      </header>

      {/* Shared conventions every component follows (shadcn/antd-style API). */}
      <div className="cd-conventions" aria-label="Shared API conventions">
        <span className="cd-conv-label">API conventions</span>
        <div className="cd-conv-chips">
          <span className="cd-conv-chip">
            Forwards <code>ref</code>
          </span>
          <span className="cd-conv-chip">
            Merges <code>className</code>
          </span>
          <span className="cd-conv-chip">
            Spreads <code>…rest</code> props
          </span>
        </div>
      </div>

      {/* Preview / Code tabs + Copy + Try it out */}
      <ComponentPreview
        entry={entry}
        onCopy={copyCode}
        onTryIt={(e) => openComponentInEditor(e, navigate)}
      />

      {props.length > 0 && (
        <section className="cd-section">
          <SectionHeading as="h2">Props</SectionHeading>
          <div className="cd-props">
            <table>
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {props.map((p) => (
                  <tr key={p.name}>
                    <td>
                      <code>{p.name}</code>
                      {p.required && <span className="cd-required" title="required">*</span>}
                    </td>
                    <td>
                      <code className="cd-type">{p.type}</code>
                    </td>
                    <td>{p.default ? <code>{p.default}</code> : <span className="cd-muted">—</span>}</td>
                    <td>{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="cd-required-note">
            <span className="cd-required">*</span> required prop
          </p>
        </section>
      )}

      {entry.playground && (
        <section className="cd-section cd-tryit">
          <SectionHeading as="h2">Try it yourself</SectionHeading>
          <p className="cd-tryit-text">
            Open an editable, runnable demo of <strong>{entry.name}</strong> in the in-browser editor —
            tweak the markup or styles and hit <strong>Run</strong> to see the result.
          </p>
          <button
            type="button"
            className="cd-tryit-btn"
            onClick={() => openComponentInEditor(entry, navigate)}
          >
            Open in editor
          </button>
        </section>
      )}

      {toast && <Toast variant={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}

export default ComponentDetail
