// Bridges the component gallery to the in-browser editor: seeds the editor's
// virtual filesystem (localStorage) with a component's playground file and
// navigates to it. Mirrors the storage contract in Editor.jsx.
const FS_KEY = 'miniEditor.fs.v1'
const ACTIVE_KEY = 'miniEditor.active.v1'
const uid = () => Math.random().toString(36).slice(2, 9)

export const openComponentInEditor = (entry, navigate) => {
  if (!entry || !entry.playground) return

  let nodes = []
  try {
    const raw = localStorage.getItem(FS_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    if (Array.isArray(parsed)) nodes = parsed
  } catch {
    nodes = []
  }

  const filename = `${entry.id}.html`
  let file = nodes.find((n) => n.type === 'file' && n.parentId === null && n.name === filename)
  if (file) {
    file.content = entry.playground
  } else {
    file = { id: uid(), name: filename, type: 'file', parentId: null, content: entry.playground }
    nodes.push(file)
  }

  localStorage.setItem(FS_KEY, JSON.stringify(nodes))
  localStorage.setItem(ACTIVE_KEY, file.id)
  navigate('/editor')
}
