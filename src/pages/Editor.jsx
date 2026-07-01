import React, { useEffect, useMemo, useState } from 'react'
import {
  File,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  FilePlus,
  FolderPlus,
  Trash2,
  FileDown,
  FolderDown,
  Play,
  Code2,
  Info,
} from 'lucide-react'
import JSZip from 'jszip'
import CodeEditor from '../components/CodeEditor'
import RunPanel from '../components/RunPanel'
import usePageMeta from '../utils/usePageMeta'
import '../styles/editor.css'

const STORAGE_KEY = 'miniEditor.fs.v1'
const ACTIVE_KEY = 'miniEditor.active.v1'

const uid = () => Math.random().toString(36).slice(2, 9)

// Starter project so the editor isn't empty on first open.
const seedNodes = () => {
  const srcId = uid()
  return [
    { id: srcId, name: 'src', type: 'folder', parentId: null },
    {
      id: uid(),
      name: 'index.js',
      type: 'file',
      parentId: srcId,
      // eslint-disable-next-line no-template-curly-in-string
      content: "function greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet('world'));\n",
    },
    {
      id: uid(),
      name: 'README.md',
      type: 'file',
      parentId: null,
      content: '# My Project\n\nCreate files and folders from the explorer, then write code here.\nEverything is saved in your browser automatically.\n',
    },
  ]
}

const loadNodes = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length) return parsed
    }
  } catch {
    /* ignore corrupt storage */
  }
  return seedNodes()
}

// Prevent a literal </script> in user code from closing our injected script tag.
const escapeScript = (code = '') => code.replace(/<\/script>/gi, '<\\/script>')

// Injected into every run so console.* and runtime errors stream back to the
// Console tab via postMessage.
const CONSOLE_SHIM = `<script>
(function () {
  function fmt(a) {
    if (a instanceof Error) return a.stack || a.message;
    if (typeof a === 'object' && a !== null) { try { return JSON.stringify(a); } catch (e) { return String(a); } }
    return String(a);
  }
  function send(type, args) {
    parent.postMessage({ __editorRun: true, type: type, text: Array.prototype.map.call(args, fmt).join(' ') }, '*');
  }
  ['log', 'info', 'warn', 'error', 'debug'].forEach(function (k) {
    var orig = console[k] ? console[k].bind(console) : function () {};
    console[k] = function () { send(k, arguments); orig.apply(console, arguments); };
  });
  window.addEventListener('error', function (e) {
    send('error', [e.message + (e.lineno ? ' (line ' + e.lineno + ')' : '')]);
  });
  window.addEventListener('unhandledrejection', function (e) {
    send('error', ['Unhandled rejection: ' + ((e.reason && e.reason.message) || e.reason)]);
  });
})();
</script>`

// Wrap a JavaScript file into a runnable HTML document.
const buildJsDoc = (code) =>
  `<!doctype html><html><head><meta charset="utf-8">${CONSOLE_SHIM}</head><body><script>
try {
${escapeScript(code)}
} catch (e) { console.error(e); }
</script></body></html>`

const Editor = () => {
  usePageMeta('Editor', 'A lightweight in-browser code editor — create files and folders and write code, saved locally.')

  const [nodes, setNodes] = useState(loadNodes)
  const [activeId, setActiveId] = useState(() => localStorage.getItem(ACTIVE_KEY) || null)
  const [expanded, setExpanded] = useState(() => new Set(nodes.filter((n) => n.type === 'folder').map((n) => n.id)))
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState('')
  const [editError, setEditError] = useState('')
  // Output panel: { open, doc, mode: 'preview'|'console', note, id }
  const [run, setRun] = useState({ open: false, doc: '', mode: 'preview', note: '', id: 0 })

  // Persist filesystem + selection.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nodes))
  }, [nodes])

  useEffect(() => {
    if (activeId) localStorage.setItem(ACTIVE_KEY, activeId)
    else localStorage.removeItem(ACTIVE_KEY)
  }, [activeId])

  // If the active file gets deleted, clear the selection.
  useEffect(() => {
    if (activeId && !nodes.some((n) => n.id === activeId && n.type === 'file')) {
      setActiveId(null)
    }
  }, [nodes, activeId])

  const activeFile = useMemo(() => nodes.find((n) => n.id === activeId) || null, [nodes, activeId])

  const childrenOf = (parentId) =>
    nodes
      .filter((n) => n.parentId === parentId)
      .sort((a, b) => {
        if (a.type !== b.type) return a.type === 'folder' ? -1 : 1
        return a.name.localeCompare(b.name)
      })

  // Full path of a node, for the editor header.
  const pathOf = (node) => {
    const parts = [node.name]
    let cur = node
    while (cur.parentId) {
      const pid = cur.parentId
      const parent = nodes.find((n) => n.id === pid)
      if (!parent) break
      parts.unshift(parent.name)
      cur = parent
    }
    return parts.join(' / ')
  }

  // A valid file name must have an extension: at least one char before the
  // dot and at least one char after it (e.g. index.js, styles.css).
  const hasValidExtension = (name) => {
    const dot = name.lastIndexOf('.')
    return dot > 0 && dot < name.length - 1
  }

  // ---- File system operations ----
  const addNode = (type, parentId) => {
    const node = { id: uid(), name: '', type, parentId, content: type === 'file' ? '' : undefined }
    setNodes((prev) => [...prev, node])
    if (parentId) setExpanded((prev) => new Set(prev).add(parentId))
    setEditingId(node.id)
    setDraft('')
    setEditError('')
  }

  // Discard a brand-new node, or revert a rename. Used on Escape / invalid blur.
  const cancelEditing = () => {
    const id = editingId
    setEditingId(null)
    setEditError('')
    if (!id) return
    setNodes((prev) => {
      const node = prev.find((n) => n.id === id)
      if (!node) return prev
      if (node.name === '') return prev.filter((n) => n.id !== id)
      return prev
    })
  }

  // Commit the typed name. Files require an extension; when `keepOnError` is
  // true (Enter) we keep editing and show a hint, otherwise (blur) we cancel.
  const commitEditing = (keepOnError) => {
    const id = editingId
    if (!id) return
    const node = nodes.find((n) => n.id === id)
    if (!node) {
      setEditingId(null)
      return
    }
    const name = draft.trim()
    if (!name) {
      cancelEditing()
      return
    }
    if (node.type === 'file' && !hasValidExtension(name)) {
      if (keepOnError) {
        setEditError('Add a file extension, e.g. .js, .css, .md')
        return
      }
      cancelEditing()
      return
    }
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, name } : n)))
    setEditingId(null)
    setEditError('')
  }

  const startRename = (node) => {
    setEditingId(node.id)
    setDraft(node.name)
    setEditError('')
  }

  const removeNode = (id) => {
    setNodes((prev) => {
      const toRemove = new Set([id])
      let frontier = [id]
      while (frontier.length) {
        const nextFrontier = []
        prev.forEach((n) => {
          if (n.parentId && toRemove.has(n.parentId) && !toRemove.has(n.id)) {
            toRemove.add(n.id)
            nextFrontier.push(n.id)
          }
        })
        frontier = nextFrontier
      }
      return prev.filter((n) => !toRemove.has(n.id))
    })
  }

  const toggleFolder = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const updateContent = (content) => {
    setNodes((prev) => prev.map((n) => (n.id === activeId ? { ...n, content } : n)))
  }

  const saveBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  // Slash-separated path of a node (for zip entries), e.g. "src/index.js".
  const fullPath = (node) => {
    const parts = [node.name]
    let cur = node
    while (cur.parentId) {
      const pid = cur.parentId
      const parent = nodes.find((n) => n.id === pid)
      if (!parent) break
      parts.unshift(parent.name)
      cur = parent
    }
    return parts.join('/')
  }

  // Download just the open file.
  const downloadActive = () => {
    if (!activeFile) return
    saveBlob(new Blob([activeFile.content ?? ''], { type: 'text/plain' }), activeFile.name || 'untitled.txt')
  }

  // Zip the whole project, preserving the folder structure, and download it.
  const downloadProject = async () => {
    const zip = new JSZip()
    nodes.forEach((n) => {
      const path = fullPath(n)
      if (n.type === 'folder') zip.folder(path)
      else zip.file(path, n.content ?? '')
    })
    const blob = await zip.generateAsync({ type: 'blob' })
    saveBlob(blob, 'project.zip')
  }

  // Find a file referenced by an HTML link/script path (matched by basename).
  const findByBasename = (path) => {
    const base = path.split(/[\\/]/).pop()
    return nodes.find((n) => n.type === 'file' && n.name === base)
  }

  // Inline same-project <link>/<script src> so a multi-file site runs as one doc.
  const buildHtmlDoc = (file) => {
    let doc = file.content || ''
    doc = doc.replace(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi, (tag) => {
      const m = tag.match(/href=["']([^"']+)["']/i)
      const f = m && findByBasename(m[1])
      return f ? `<style>\n${f.content || ''}\n</style>` : tag
    })
    doc = doc.replace(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>\s*<\/script>/gi, (tag, src) => {
      const f = findByBasename(src)
      return f ? `<script>\n${escapeScript(f.content || '')}\n</script>` : tag
    })
    // Inject the console shim so logs/errors from the page reach the Console tab.
    if (/<head\b[^>]*>/i.test(doc)) doc = doc.replace(/<head\b[^>]*>/i, (h) => h + CONSOLE_SHIM)
    else doc = CONSOLE_SHIM + doc
    return doc
  }

  const runActive = () => {
    if (!activeFile) return
    const ext = (activeFile.name.split('.').pop() || '').toLowerCase()
    const nextId = run.id + 1

    if (ext === 'html' || ext === 'htm') {
      setRun({ open: true, doc: buildHtmlDoc(activeFile), mode: 'preview', note: '', id: nextId })
    } else if (['js', 'mjs', 'cjs'].includes(ext)) {
      setRun({ open: true, doc: buildJsDoc(activeFile.content || ''), mode: 'console', id: nextId, note: '' })
    } else {
      setRun({
        open: true,
        doc: '',
        mode: 'console',
        note: 'Run is supported for .html and .js files. Open an HTML or JavaScript file and click Run.',
        id: nextId,
      })
    }
  }

  const closeRun = () => setRun((prev) => ({ ...prev, open: false }))

  // ---- Tree rendering ----
  const renderRow = (node, depth) => {
    const isFolder = node.type === 'folder'
    const isOpen = expanded.has(node.id)
    const isActive = node.id === activeId
    const isEditing = node.id === editingId

    return (
      <li key={node.id} className="tree-item">
        <div
          className={`tree-row${isActive ? ' is-active' : ''}`}
          style={{ paddingLeft: depth * 14 + 8 }}
          onClick={() => (isFolder ? toggleFolder(node.id) : setActiveId(node.id))}
          onDoubleClick={() => startRename(node)}
        >
          <span className="tree-caret">
            {isFolder ? (
              isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
            ) : (
              <span className="tree-caret-spacer" />
            )}
          </span>

          <span className="tree-icon">
            {isFolder ? (
              isOpen ? <FolderOpen size={15} /> : <Folder size={15} />
            ) : (
              <File size={15} />
            )}
          </span>

          {isEditing ? (
            <input
              className={`tree-input${editError ? ' has-error' : ''}`}
              value={draft}
              autoFocus
              onFocus={(e) => e.target.select()}
              onChange={(e) => {
                setDraft(e.target.value)
                if (editError) setEditError('')
              }}
              onClick={(e) => e.stopPropagation()}
              onBlur={() => commitEditing(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitEditing(true)
                else if (e.key === 'Escape') cancelEditing()
              }}
              placeholder={node.type === 'file' ? 'filename.ext' : 'folder name'}
            />
          ) : (
            <span className="tree-name">{node.name}</span>
          )}

          <span className="tree-actions" onClick={(e) => e.stopPropagation()}>
            {isFolder && (
              <>
                <button type="button" title="New file" onClick={() => addNode('file', node.id)}>
                  <FilePlus size={14} />
                </button>
                <button type="button" title="New folder" onClick={() => addNode('folder', node.id)}>
                  <FolderPlus size={14} />
                </button>
              </>
            )}
            <button type="button" title="Delete" onClick={() => removeNode(node.id)}>
              <Trash2 size={14} />
            </button>
          </span>
        </div>

        {isEditing && editError && (
          <div className="tree-error" style={{ paddingLeft: depth * 14 + 36 }}>
            {editError}
          </div>
        )}

        {isFolder && isOpen && (
          <ul className="tree-children">{childrenOf(node.id).map((c) => renderRow(c, depth + 1))}</ul>
        )}
      </li>
    )
  }

  return (
    <div className="editor-page">
      <div className="editor-notice" role="note">
        <Info size={16} aria-hidden="true" />
        <span>
          This is an <strong>experimental</strong> editor — it may not be fully functional as a real
          code editor. Your files are saved only in this browser.
        </span>
      </div>

      <div className="editor-shell">
        {/* ---------- Explorer ---------- */}
        <aside className="editor-sidebar">
          <div className="explorer-head">
            <span className="explorer-title">Explorer</span>
            <div className="explorer-actions">
              <button type="button" title="New file" onClick={() => addNode('file', null)}>
                <FilePlus size={15} />
              </button>
              <button type="button" title="New folder" onClick={() => addNode('folder', null)}>
                <FolderPlus size={15} />
              </button>
            </div>
          </div>

          <ul className="tree-root">
            {childrenOf(null).length === 0 && (
              <li className="tree-empty">No files yet. Use the + buttons above.</li>
            )}
            {childrenOf(null).map((node) => renderRow(node, 0))}
          </ul>
        </aside>

        {/* ---------- Editor ---------- */}
        <main className="editor-main">
          {activeFile ? (
            <>
              <div className="editor-workspace">
                <div className="editor-tabbar">
                  <span className="editor-path">
                    <File size={14} aria-hidden="true" />
                    {pathOf(activeFile)}
                  </span>
                  <div className="editor-tab-actions">
                    <button
                      className="editor-action editor-action--run"
                      type="button"
                      onClick={runActive}
                      title="Run (HTML / JavaScript)"
                    >
                      <Play size={15} aria-hidden="true" />
                      <span>Run</span>
                    </button>
                    <button
                      className="editor-action"
                      type="button"
                      onClick={downloadActive}
                      title="Download this file"
                    >
                      <FileDown size={15} aria-hidden="true" />
                      <span>File</span>
                    </button>
                    <button
                      className="editor-action"
                      type="button"
                      onClick={downloadProject}
                      title="Download the whole project as a .zip"
                    >
                      <FolderDown size={15} aria-hidden="true" />
                      <span>Project</span>
                    </button>
                  </div>
                </div>

                <div className="editor-area">
                  <CodeEditor
                    key={activeFile.id}
                    filename={activeFile.name}
                    value={activeFile.content ?? ''}
                    onChange={updateContent}
                  />
                </div>
              </div>

              {run.open && <RunPanel run={run} onClose={closeRun} onRerun={runActive} />}
            </>
          ) : (
            <div className="editor-empty">
              <Code2 size={44} aria-hidden="true" />
              <h2>No file open</h2>
              <p>Select a file from the explorer, or create a new one to start writing code.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Editor
