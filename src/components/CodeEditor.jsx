import React, { useMemo } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { keymap } from '@codemirror/view'
import { indentWithTab } from '@codemirror/commands'
import { githubLight, githubDark } from '@uiw/codemirror-theme-github'
import { javascript } from '@codemirror/lang-javascript'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { json } from '@codemirror/lang-json'
import { markdown } from '@codemirror/lang-markdown'
import { python } from '@codemirror/lang-python'
import { useTheme } from 'next-themes'

// Pick the CodeMirror language extension from the file extension.
const languageFor = (filename = '') => {
  const ext = filename.split('.').pop().toLowerCase()
  switch (ext) {
    case 'js':
    case 'jsx':
    case 'mjs':
    case 'cjs':
      return javascript({ jsx: true })
    case 'ts':
    case 'tsx':
      return javascript({ jsx: true, typescript: true })
    case 'html':
    case 'htm':
      return html()
    case 'css':
    case 'scss':
    case 'less':
      return css()
    case 'json':
      return json()
    case 'md':
    case 'markdown':
      return markdown()
    case 'py':
      return python()
    default:
      return null
  }
}

/*
 * CodeEditor — a real code editor (CodeMirror 6) with syntax highlighting,
 * line numbers, active-line, bracket matching/closing, code folding,
 * autocompletion and Tab-to-indent. Language is inferred from the filename;
 * the theme follows the site's light/dark mode.
 */
const CodeEditor = ({ filename, value, onChange }) => {
  const { resolvedTheme } = useTheme()

  const extensions = useMemo(() => {
    const lang = languageFor(filename)
    const base = [keymap.of([indentWithTab])]
    return lang ? [lang, ...base] : base
  }, [filename])

  return (
    <CodeMirror
      className="cm-host"
      value={value}
      onChange={onChange}
      theme={resolvedTheme === 'dark' ? githubDark : githubLight}
      extensions={extensions}
      height="100%"
      basicSetup={{
        lineNumbers: true,
        highlightActiveLine: true,
        highlightActiveLineGutter: true,
        bracketMatching: true,
        closeBrackets: true,
        autocompletion: true,
        foldGutter: true,
        indentOnInput: true,
        highlightSelectionMatches: true,
      }}
    />
  )
}

export default CodeEditor
