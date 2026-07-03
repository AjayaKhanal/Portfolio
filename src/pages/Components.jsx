import React, { useState, useRef, useLayoutEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, X, ChevronDown, ChevronRight, ArrowRight } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'
import { COMPONENTS, COMPONENT_CATEGORIES } from '../constants/componentsRegistry'
import usePageMeta from '../utils/usePageMeta'
import '../styles/components-page.css'

const catId = (cat) => `cat-${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

/*
 * Gallery-only preview box: renders the demo inside a fixed-height tile and
 * scales it DOWN (never up) so the whole component fits without clipping.
 * Only used on the components page — the detail page shows demos full size.
 */
const FitPreview = ({ children }) => {
  const boxRef = useRef(null)
  const contentRef = useRef(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const box = boxRef.current
    const content = contentRef.current
    if (!box || !content) return

    const fit = () => {
      const cs = getComputedStyle(box)
      const availW = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      const availH = box.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
      // scrollWidth/Height ignore the transform, so we always read natural size.
      const w = content.scrollWidth
      const h = content.scrollHeight
      if (!w || !h) return
      setScale(Math.min(1, availW / w, availH / h))
    }

    fit()
    // Re-fit when the box resizes (responsive) or the demo's size settles
    // (e.g. GitHubActivity finishes loading, TypingText finishes typing).
    const ro = new ResizeObserver(fit)
    ro.observe(box)
    ro.observe(content)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={boxRef} className="comp-tile-preview">
      <div
        ref={contentRef}
        className="comp-tile-fit"
        style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  )
}

const Components = () => {
  usePageMeta(
    'Components',
    'A live, searchable gallery of the reusable React components built for this portfolio.'
  )
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [collapsed, setCollapsed] = useState(new Set())

  const allCategories = COMPONENT_CATEGORIES.filter((cat) => COMPONENTS.some((c) => c.category === cat))

  // ---- Live search + category filter ----
  const q = query.trim().toLowerCase()
  const matches = (c) =>
    (filter === 'All' || c.category === filter) &&
    (!q ||
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q))

  const filtered = COMPONENTS.filter(matches)
  const visibleCategories = allCategories.filter((cat) => filtered.some((c) => c.category === cat))

  const toggleCollapse = (cat) =>
    setCollapsed((prev) => {
      const next = new Set(prev)
      next.has(cat) ? next.delete(cat) : next.add(cat)
      return next
    })

  const openDetail = (id) => navigate(`/components/${id}`)

  return (
    <div className="components-page">
      <header className="components-hero" data-reveal="up">
        <span className="components-eyebrow">Component Library</span>
        <h1 className="components-title">Reusable Components</h1>
        <p className="components-lead">
          A library of reusable React components with consistent, composable APIs — variants, ref
          forwarding, <code>className</code> merging, and prop spreading. Search or filter, then open any
          component for its preview, code, props, and an editable demo.
        </p>
      </header>

      {/* ---------- Search + filter ---------- */}
      <div className="components-toolbar">
        <div className="components-search">
          <Search size={16} aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search components by name or description…"
            aria-label="Search components"
          />
          {query && (
            <button type="button" className="components-search-clear" onClick={() => setQuery('')} aria-label="Clear search">
              <X size={15} aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="components-filters" role="group" aria-label="Filter by category">
          <button
            type="button"
            className={`components-filter${filter === 'All' ? ' is-active' : ''}`}
            onClick={() => setFilter('All')}
          >
            All
          </button>
          {allCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`components-filter${filter === cat ? ' is-active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="components-layout">
        {/* ---------- Collapsible sidebar ---------- */}
        <aside className="components-sidebar" aria-label="Component index">
          {visibleCategories.length === 0 ? (
            <p className="components-sidebar-empty">No matches</p>
          ) : (
            visibleCategories.map((cat) => {
              const items = filtered.filter((c) => c.category === cat)
              const isCollapsed = collapsed.has(cat)
              return (
                <div className="sidebar-group" key={cat}>
                  <button
                    type="button"
                    className="sidebar-group-head"
                    onClick={() => toggleCollapse(cat)}
                    aria-expanded={!isCollapsed}
                  >
                    {isCollapsed ? <ChevronRight size={15} aria-hidden="true" /> : <ChevronDown size={15} aria-hidden="true" />}
                    <span className="sidebar-group-name">{cat}</span>
                    <span className="sidebar-group-count">{items.length}</span>
                  </button>
                  {!isCollapsed && (
                    <ul className="sidebar-list">
                      {items.map((c) => (
                        <li key={c.id}>
                          <Link to={`/components/${c.id}`} className="sidebar-link">
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })
          )}
        </aside>

        {/* ---------- Component tiles (name + preview) ---------- */}
        <div className="components-main">
          {filtered.length === 0 ? (
            <div className="components-empty">
              <p>
                No components match{query ? <> “<strong>{query}</strong>”</> : ' the current filter'}.
              </p>
              <button
                type="button"
                className="components-empty-reset"
                onClick={() => {
                  setQuery('')
                  setFilter('All')
                }}
              >
                Clear search &amp; filter
              </button>
            </div>
          ) : (
            visibleCategories.map((cat) => (
              <section key={cat} id={catId(cat)} className="components-section">
                <SectionHeading>{cat}</SectionHeading>
                <div className="components-grid">
                  {filtered
                    .filter((c) => c.category === cat)
                    .map((entry) => (
                      <article
                        key={entry.id}
                        className="comp-tile"
                        data-reveal="up"
                        role="link"
                        tabIndex={0}
                        onClick={() => openDetail(entry.id)}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openDetail(entry.id)}
                        aria-label={`${entry.name} — view details`}
                      >
                        <FitPreview>
                          <entry.Demo />
                        </FitPreview>
                        <div className="comp-tile-foot">
                          <span className="comp-tile-name">{entry.name}</span>
                          <ArrowRight size={16} className="comp-tile-arrow" aria-hidden="true" />
                        </div>
                      </article>
                    ))}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Components
