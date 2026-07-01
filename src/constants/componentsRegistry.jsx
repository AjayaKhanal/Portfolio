import React, { useState } from 'react'
import Button from '../components/Button'
import TechBadge from '../components/TechBadge'
import SectionHeading from '../components/SectionHeading'
import SocialLinks from '../components/SocialLinks'
import Pagination from '../components/Pagination'
import SearchBar from '../components/SearchBar'
import Toast from '../components/Toast'
import ProjectCard from '../components/ProjectCard'
import { ThemeSwitcher } from '../components/Themes'
// Raw source of each component (webpack ?raw -> string) for the "Code" tab.
import buttonSrc from '../components/Button.jsx?raw'
import themeSrc from '../components/Themes.jsx?raw'
import techBadgeSrc from '../components/TechBadge.jsx?raw'
import sectionHeadingSrc from '../components/SectionHeading.jsx?raw'
import socialLinksSrc from '../components/SocialLinks.jsx?raw'
import projectCardSrc from '../components/ProjectCard.jsx?raw'
import paginationSrc from '../components/Pagination.jsx?raw'
import searchBarSrc from '../components/SearchBar.jsx?raw'
import toastSrc from '../components/Toast.jsx?raw'
import '../styles/pagination.css'

/*
 * Registry of the reusable components built for this portfolio.
 * Each entry drives the /components gallery:
 *   - Demo:       live React render (a component, so it can use hooks)
 *   - code:       the JSX snippet shown in the Code tab / copied to clipboard
 *   - playground: optional standalone HTML doc opened in the editor's "Try it out"
 *                 (runs as-is via the editor's Run button)
 */

// Small helper to assemble a runnable HTML playground document.
const htmlDoc = (title, css, body) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    :root {
      --primary: #3b82f6;
      --primary-hover: #2563eb;
      --ring: #d4d4d8;
      --muted: #f4f4f5;
      --fg: #111827;
      --card: #ffffff;
    }
    * { box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 2rem;
      background: #fafafa;
      color: var(--fg);
    }
    .hint { margin-top: 1.25rem; color: #6b7280; font-size: .9rem; }
${css}
  </style>
</head>
<body>
${body}
</body>
</html>`

// ---- Sample data for previews that need props ----
const sampleProject = {
  slug: 'portfolio',
  title: 'Portfolio Website',
  description: 'A personal portfolio to showcase projects, skills, and achievements.',
  techStack: ['React', 'CSS', 'JavaScript', 'MDX'],
  githubLink: 'https://github.com/',
  liveDemo: 'https://example.com',
  image: '',
}

export const COMPONENT_CATEGORIES = ['Actions', 'Display', 'Navigation', 'Inputs', 'Feedback']

export const COMPONENTS = [
  // ---------- Actions ----------
  {
    id: 'button',
    name: 'Button',
    category: 'Actions',
    description: 'Primary action button with an onclick handler.',
    Demo: () => <Button text="Click me" onclick={() => {}} />,
    code: `<Button text="Click me" onclick={() => alert('Clicked!')} />`,
    playground: htmlDoc(
      'Button',
      `    .button {
      display: inline-flex; align-items: center; gap: .5rem;
      padding: .7rem 1.4rem; border: none; border-radius: 8px;
      background: var(--primary); color: #fff; font-weight: 600;
      font-size: 1rem; cursor: pointer;
      transition: transform .2s ease, background .2s ease;
    }
    .button:hover { background: var(--primary-hover); transform: translateY(-2px); }`,
      `  <button class="button" onclick="alert('Clicked!')">Click me</button>
  <p class="hint">Edit the label, colors, or the onclick above, then press Run.</p>`
    ),
  },
  {
    id: 'theme-switcher',
    name: 'ThemeSwitcher',
    category: 'Actions',
    description: 'Segmented control to switch between system, light, and dark themes.',
    Demo: () => <ThemeSwitcher />,
    code: `import { ThemeSwitcher } from './components/Themes'

<ThemeSwitcher />`,
    playground: null,
  },

  // ---------- Display ----------
  {
    id: 'tech-badge',
    name: 'TechBadge',
    category: 'Display',
    description: 'A single tech/skill pill, used on project cards and the detail page.',
    Demo: () => (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        <TechBadge tech="React" />
        <TechBadge tech="CSS" />
        <TechBadge tech="JavaScript" />
      </div>
    ),
    code: `<TechBadge tech="React" />`,
    playground: htmlDoc(
      'TechBadge',
      `    .tech-badge {
      display: inline-block; padding: .25rem .55rem; margin: .2rem;
      background: #eef2ff; color: #111827; border: 1px solid #c7d2fe;
      border-radius: 6px; font-size: .85rem; font-weight: 500;
    }`,
      `  <span class="tech-badge">React</span>
  <span class="tech-badge">CSS</span>
  <span class="tech-badge">JavaScript</span>
  <p class="hint">Add more badges or change the colors, then press Run.</p>`
    ),
  },
  {
    id: 'section-heading',
    name: 'SectionHeading',
    category: 'Display',
    description: 'Underlined section heading. Use the `as` prop to set the level (h2/h3).',
    Demo: () => <SectionHeading>Skills &amp; Technologies</SectionHeading>,
    code: `<SectionHeading>Skills & Technologies</SectionHeading>

// custom level
<SectionHeading as="h3">Smaller heading</SectionHeading>`,
    playground: htmlDoc(
      'SectionHeading',
      `    .section-heading {
      font-size: 1.6rem; font-weight: 700; position: relative;
      padding-bottom: .55rem; margin: 0;
    }
    .section-heading::after {
      content: ''; position: absolute; left: 0; bottom: 0;
      width: 52px; height: 3px; background: var(--primary); border-radius: 2px;
    }`,
      `  <h2 class="section-heading">My Section</h2>
  <p class="hint">Change the text or the underline color, then press Run.</p>`
    ),
  },
  {
    id: 'social-links',
    name: 'SocialLinks',
    category: 'Display',
    description: 'Renders social links from shared data (icon or text variant).',
    Demo: () => (
      <SocialLinks as="div" className="comp-social-demo" linkClassName="comp-social-link" iconSize={22} />
    ),
    code: `// data lives in src/constants/socials.js
<SocialLinks
  as="div"
  className="footer-socials"
  linkClassName="footer-social"
  iconSize={20}
/>

// text variant, subset
<SocialLinks variant="text" items={SOCIAL_LINKS.filter(s => s.label !== 'Email')} />`,
    playground: null,
  },
  {
    id: 'project-card',
    name: 'ProjectCard',
    category: 'Display',
    description: 'Project card with thumbnail (or gradient fallback), tech badges, and links.',
    Demo: () => (
      <div style={{ maxWidth: 320 }}>
        <ProjectCard project={sampleProject} view="grid" />
      </div>
    ),
    code: `<ProjectCard project={project} view="grid" />
// view="list" renders the horizontal layout`,
    playground: null,
  },

  // ---------- Navigation ----------
  {
    id: 'pagination',
    name: 'Pagination',
    category: 'Navigation',
    description: 'Numbered pagination control; hides itself when there is only one page.',
    Demo: function PaginationDemo() {
      const [page, setPage] = useState(2)
      return <Pagination current={page} total={6} onPageChange={setPage} />
    },
    code: `<Pagination current={page} total={6} onPageChange={setPage} />`,
    playground: null,
  },

  // ---------- Inputs ----------
  {
    id: 'search-bar',
    name: 'SearchBar',
    category: 'Inputs',
    description: 'Debounced search input with clear/search controls.',
    Demo: function SearchBarDemo() {
      const [, setQuery] = useState('')
      return (
        <div style={{ maxWidth: 360 }}>
          <SearchBar setSearchQuery={setQuery} />
        </div>
      )
    },
    code: `<SearchBar setSearchQuery={setSearchQuery} />`,
    playground: null,
  },

  // ---------- Feedback ----------
  {
    id: 'toast',
    name: 'Toast',
    category: 'Feedback',
    description: 'Auto-dismissing toast notification (success / error / sending).',
    Demo: function ToastDemo() {
      const [toast, setToast] = useState(null)
      return (
        <>
          <Button text="Show toast" onclick={() => setToast({ type: 'success', message: 'Saved successfully!' })} />
          {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
        </>
      )
    },
    code: `{toast && (
  <Toast type="success" message="Saved!" onClose={() => setToast(null)} />
)}`,
    playground: htmlDoc(
      'Toast',
      `    .btn {
      padding: .65rem 1.2rem; border: none; border-radius: 8px;
      background: var(--primary); color: #fff; font-weight: 600; cursor: pointer;
    }
    .toast {
      position: fixed; top: 1.25rem; right: 1.25rem; display: flex; align-items: center;
      gap: .6rem; padding: .85rem 1rem; border-radius: 12px; background: #fff;
      border: 1px solid var(--ring); border-left: 4px solid #22c55e;
      box-shadow: 0 8px 24px rgba(0,0,0,.15); font-weight: 500;
      animation: slide .3s ease;
    }
    @keyframes slide { from { transform: translateX(120%); opacity: 0; } to { transform: none; opacity: 1; } }`,
      `  <button class="btn" onclick="showToast()">Show toast</button>
  <p class="hint">Press Run, then click the button.</p>
  <script>
    function showToast() {
      const t = document.createElement('div');
      t.className = 'toast';
      t.textContent = '✓  Saved successfully!';
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 4000);
    }
  </script>`
    ),
  },
]

// Attach each component's real source code (shown in the "Code" tab).
const SOURCES = {
  button: buttonSrc,
  'theme-switcher': themeSrc,
  'tech-badge': techBadgeSrc,
  'section-heading': sectionHeadingSrc,
  'social-links': socialLinksSrc,
  'project-card': projectCardSrc,
  pagination: paginationSrc,
  'search-bar': searchBarSrc,
  toast: toastSrc,
}
COMPONENTS.forEach((c) => {
  c.source = SOURCES[c.id]
})

// Prop reference per component, shown on the detail page.
export const COMPONENT_PROPS = {
  button: [
    { name: 'text', type: 'string', required: true, description: 'The button label.' },
    { name: 'onclick', type: 'function', description: 'Click handler.' },
  ],
  'theme-switcher': [
    { name: 'className', type: 'string', description: 'Extra class names for the wrapper.' },
  ],
  'tech-badge': [
    { name: 'tech', type: 'string', required: true, description: 'The text shown in the badge.' },
    { name: 'className', type: 'string', description: 'Extra class names (e.g. a modifier).' },
  ],
  'section-heading': [
    { name: 'children', type: 'node', required: true, description: 'Heading content.' },
    { name: 'as', type: "'h2' | 'h3'", default: "'h2'", description: 'Heading element/level.' },
    { name: 'className', type: 'string', description: 'Extra class names.' },
  ],
  'social-links': [
    { name: 'as', type: 'element', default: "'ul'", description: 'Container element (ul/div).' },
    { name: 'variant', type: "'icon' | 'text'", default: "'icon'", description: 'Render icons or text labels.' },
    { name: 'items', type: 'array', default: 'SOCIAL_LINKS', description: 'Subset of links to render.' },
    { name: 'iconSize', type: 'number', default: '20', description: 'Icon size in px.' },
    { name: 'className', type: 'string', description: 'Container class.' },
    { name: 'linkClassName', type: 'string', description: 'Class for each link.' },
    { name: 'withListItems', type: 'boolean', default: 'false', description: 'Wrap each link in an <li>.' },
  ],
  'project-card': [
    { name: 'project', type: 'object', required: true, description: 'Project data (title, description, techStack, links, image).' },
    { name: 'view', type: "'grid' | 'list'", default: "'grid'", description: 'Card layout.' },
  ],
  pagination: [
    { name: 'current', type: 'number', required: true, description: 'The active page (1-based).' },
    { name: 'total', type: 'number', required: true, description: 'Total number of pages.' },
    { name: 'onPageChange', type: 'function', required: true, description: 'Called with the new page number.' },
  ],
  'search-bar': [
    { name: 'setSearchQuery', type: 'function', required: true, description: 'Receives the debounced query string.' },
  ],
  toast: [
    { name: 'type', type: "'success' | 'error' | 'sending'", default: "'success'", description: 'Visual style.' },
    { name: 'message', type: 'string', required: true, description: 'The text shown.' },
    { name: 'duration', type: 'number', default: '4000', description: 'Auto-dismiss delay (ms).' },
    { name: 'onClose', type: 'function', required: true, description: 'Called on dismiss.' },
  ],
}
