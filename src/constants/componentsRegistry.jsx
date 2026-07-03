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
import TypingText from '../components/TypingText'
import TechOrbit from '../components/TechOrbit'
import Terminal from '../components/Terminal'
import IDCard from '../components/IDCard'
import GitHubActivity from '../components/GitHubActivity'
import { CoderProfileCard } from '../components/Code'
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
import typingTextSrc from '../components/TypingText.js?raw'
import techOrbitSrc from '../components/TechOrbit.jsx?raw'
import terminalSrc from '../components/Terminal.jsx?raw'
import idCardSrc from '../components/IDCard.jsx?raw'
import gitHubActivitySrc from '../components/GitHubActivity.jsx?raw'
import coderProfileCardSrc from '../components/Code.jsx?raw'
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

// Generic, non-portfolio-specific data so the reusable components demo cleanly.
const sampleProfile = {
  name: 'Jane Doe',
  role: 'Frontend Engineer',
  location: 'Remote',
  skills: ['React', 'TypeScript', 'CSS', 'Node.js', 'GraphQL', 'Jest'],
}

const sampleTerminalProfile = {
  user: 'jane@demo',
  path: '~',
  shell: 'zsh',
  name: 'Jane Doe',
  role: 'Frontend Engineer',
  location: 'Remote',
  about: 'I build fast, accessible web apps with a focus on great UX.',
  skills: sampleProfile.skills,
  links: [
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'Website', href: 'https://example.com' },
  ],
}

export const COMPONENT_CATEGORIES = ['Actions', 'Display', 'Navigation', 'Inputs', 'Feedback', 'Animation']

export const COMPONENTS = [
  // ---------- Actions ----------
  {
    id: 'button',
    name: 'Button',
    category: 'Actions',
    description: 'Primary action button — variant + size props, forwards ref, spreads props.',
    Demo: () => (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
        <Button onClick={() => {}}>Primary</Button>
        <Button variant="ghost" onClick={() => {}}>Ghost</Button>
        <Button variant="outline" size="sm" onClick={() => {}}>Outline</Button>
      </div>
    ),
    code: `<Button onClick={() => alert('Clicked!')}>Click me</Button>

// variants + sizes
<Button variant="ghost">Ghost</Button>
<Button variant="outline" size="sm">Small outline</Button>`,
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
        <TechBadge>React</TechBadge>
        <TechBadge>CSS</TechBadge>
        <TechBadge variant="more">+3</TechBadge>
      </div>
    ),
    code: `<TechBadge>React</TechBadge>

// "+N more" style
<TechBadge variant="more">+3</TechBadge>`,
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
  {
    id: 'id-card',
    name: 'IDCard',
    category: 'Display',
    description: 'Interactive credential card with 3D tilt, holo shine, QR code, and a flip side.',
    Demo: () => (
      <IDCard
        name="Jane Doe"
        role="Frontend Engineer"
        company="Acme Inc."
        location="Remote"
        skills={sampleProfile.skills}
        kicker="Developer Credential"
        description="I build fast, accessible web apps with a focus on great UX and clean, maintainable code."
        link="https://example.com"
      />
    ),
    code: `<IDCard
  name="Jane Doe"
  role="Frontend Engineer"
  company="Acme Inc."
  location="Remote"
  skills={['React', 'TypeScript', 'CSS']}
  description="Short bio shown on the back of the card."
  link="https://example.com"
/>`,
    playground: null,
  },
  {
    id: 'coder-profile-card',
    name: 'CoderProfileCard',
    category: 'Display',
    description: 'A code-editor styled card that renders a profile object as a JS snippet.',
    Demo: () => <CoderProfileCard data={sampleProfile} fileName="jane.js" />,
    code: `const profile = {
  name: 'Jane Doe',
  role: 'Frontend Engineer',
  location: 'Remote',
  skills: ['React', 'TypeScript', 'CSS'],
}

<CoderProfileCard data={profile} fileName="jane.js" />`,
    playground: null,
  },
  {
    id: 'tech-orbit',
    name: 'TechOrbit',
    category: 'Display',
    description: 'Animated orbit of tech/skill chips rotating on two rings around a core.',
    Demo: () => (
      <TechOrbit
        skills={sampleProfile.skills}
        title="Technologies I work with"
        eyebrow="My Stack"
      />
    ),
    code: `<TechOrbit
  skills={['React', 'TypeScript', 'CSS', 'Node.js', 'GraphQL']}
  title="Technologies I work with"
  eyebrow="My Stack"
/>`,
    playground: null,
  },
  {
    id: 'github-activity',
    name: 'GitHubActivity',
    category: 'Display',
    description: 'GitHub contribution heatmap with year switcher, stats, and top-languages cards.',
    Demo: () => <GitHubActivity username="ajayakhanal" />,
    code: `<GitHubActivity username="octocat" />

// custom year range
<GitHubActivity username="octocat" years={[2025, 2024, 2023]} />`,
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
          <SearchBar onSearch={setQuery} placeholder="Search…" />
        </div>
      )
    },
    code: `<SearchBar onSearch={setQuery} placeholder="Search projects…" />`,
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
          <Button onClick={() => setToast({ variant: 'success', message: 'Saved successfully!' })}>Show toast</Button>
          {toast && <Toast variant={toast.variant} message={toast.message} onClose={() => setToast(null)} />}
        </>
      )
    },
    code: `{toast && (
  <Toast variant="success" message="Saved!" onClose={() => setToast(null)} />
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
  {
    id: 'terminal',
    name: 'Terminal',
    category: 'Feedback',
    description: 'Interactive fake shell — type commands (help, whoami, skills…) driven by a profile.',
    Demo: () => (
      <div style={{ maxWidth: 520 }}>
        <Terminal profile={sampleTerminalProfile} />
      </div>
    ),
    code: `const profile = {
  user: 'jane@demo',
  path: '~',
  name: 'Jane Doe',
  role: 'Frontend Engineer',
  location: 'Remote',
  about: 'I build fast, accessible web apps.',
  skills: ['React', 'TypeScript', 'CSS'],
  links: [{ label: 'GitHub', href: 'https://github.com/' }],
}

<Terminal profile={profile} />`,
    playground: null,
  },

  // ---------- Animation ----------
  {
    id: 'typing-text',
    name: 'TypingText',
    category: 'Animation',
    description: 'Types out content character-by-character, with optional per-segment styling.',
    Demo: function TypingTextDemo({ previewKey = 0 }) {
      return (
        <TypingText
          // Vary the id per refresh so the once-per-session guard lets it replay.
          id={`typing-text-demo-${previewKey}`}
          speed={45}
          content={['Hi, I build ', { text: 'reusable', className: 'skill' }, ' components.']}
        />
      )
    },
    code: `<TypingText
  content={[
    'Hi, I build ',
    { text: 'reusable', className: 'skill' },
    ' components.',
  ]}
  speed={45}
/>`,
    playground: null,
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
  'id-card': idCardSrc,
  'coder-profile-card': coderProfileCardSrc,
  'tech-orbit': techOrbitSrc,
  'github-activity': gitHubActivitySrc,
  terminal: terminalSrc,
  'typing-text': typingTextSrc,
}
COMPONENTS.forEach((c) => {
  c.source = SOURCES[c.id]
})

// Prop reference per component, shown on the detail page.
export const COMPONENT_PROPS = {
  button: [
    { name: 'children', type: 'node', required: true, description: 'The button label/content.' },
    { name: 'variant', type: "'primary' | 'ghost' | 'outline'", default: "'primary'", description: 'Visual style.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Button size.' },
    { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'Native button type.' },
    { name: 'className', type: 'string', description: 'Extra class names (merged).' },
    { name: '…rest', type: 'HTMLButtonAttributes', description: 'onClick, disabled, aria-*, … spread onto the <button>.' },
  ],
  'theme-switcher': [
    { name: 'className', type: 'string', description: 'Extra class names for the wrapper.' },
    { name: '…rest', type: 'HTMLDivAttributes', description: 'Spread onto the wrapper element.' },
  ],
  'tech-badge': [
    { name: 'children', type: 'node', required: true, description: 'The text shown in the badge.' },
    { name: 'variant', type: "'default' | 'more'", default: "'default'", description: 'Visual style.' },
    { name: 'className', type: 'string', description: 'Extra class names (merged).' },
    { name: '…rest', type: 'HTMLSpanAttributes', description: 'Spread onto the <span>.' },
  ],
  'section-heading': [
    { name: 'children', type: 'node', required: true, description: 'Heading content.' },
    { name: 'as', type: "'h1'–'h6'", default: "'h2'", description: 'Heading element/level.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Heading size.' },
    { name: 'className', type: 'string', description: 'Extra class names (merged).' },
    { name: '…rest', type: 'HTMLHeadingAttributes', description: 'Spread onto the heading element.' },
  ],
  'social-links': [
    { name: 'as', type: 'element', default: "'ul'", description: 'Container element (ul/div).' },
    { name: 'variant', type: "'icon' | 'text'", default: "'icon'", description: 'Render icons or text labels.' },
    { name: 'items', type: 'array', default: 'SOCIAL_LINKS', description: 'Subset of links to render.' },
    { name: 'iconSize', type: 'number', default: '20', description: 'Icon size in px.' },
    { name: 'className', type: 'string', description: 'Container class (merged).' },
    { name: 'linkClassName', type: 'string', description: 'Class for each link.' },
    { name: 'withListItems', type: 'boolean', default: 'false', description: 'Wrap each link in an <li>.' },
    { name: 'ariaLabel', type: 'string', default: "'Social links'", description: 'Accessible label for the container.' },
    { name: '…rest', type: 'HTMLAttributes', description: 'Spread onto the container element.' },
  ],
  'project-card': [
    { name: 'project', type: 'object', required: true, description: 'Project data (title, description, techStack, links, image).' },
    { name: 'view', type: "'grid' | 'list'", default: "'grid'", description: 'Card layout.' },
    { name: 'className', type: 'string', description: 'Extra class names (merged).' },
    { name: '…rest', type: 'HTMLAttributes', description: 'Spread onto the <article>.' },
  ],
  pagination: [
    { name: 'current', type: 'number', required: true, description: 'The active page (1-based).' },
    { name: 'total', type: 'number', required: true, description: 'Total number of pages.' },
    { name: 'onPageChange', type: 'function', required: true, description: 'Called with the new page number.' },
    { name: 'className', type: 'string', description: 'Extra class names (merged).' },
    { name: '…rest', type: 'HTMLAttributes', description: 'Spread onto the wrapper.' },
  ],
  'search-bar': [
    { name: 'onSearch', type: 'function', required: true, description: 'Receives the debounced query string (on type, Enter, and clear).' },
    { name: 'placeholder', type: 'string', default: "'Search…'", description: 'Input placeholder.' },
    { name: 'defaultValue', type: 'string', default: "''", description: 'Initial input text.' },
    { name: 'debounce', type: 'number', default: '500', description: 'Debounce delay in ms.' },
    { name: 'className', type: 'string', description: 'Extra class names on the wrapper (merged).' },
    { name: '…rest', type: 'HTMLInputAttributes', description: 'Spread onto the <input>.' },
  ],
  toast: [
    { name: 'variant', type: "'success' | 'error' | 'sending'", default: "'success'", description: 'Visual style.' },
    { name: 'children', type: 'node', description: 'Toast content (falls back to `message`).' },
    { name: 'message', type: 'string', description: 'Text shown when no children are given.' },
    { name: 'duration', type: 'number', default: '4000', description: 'Auto-dismiss delay (ms).' },
    { name: 'onClose', type: 'function', required: true, description: 'Called on dismiss.' },
    { name: 'className', type: 'string', description: 'Extra class names (merged).' },
  ],
  'id-card': [
    { name: 'name', type: 'string', required: true, description: 'Full name (drives the avatar initials and ID).' },
    { name: 'role', type: 'string', required: true, description: 'Job title / role.' },
    { name: 'company', type: 'string', description: 'Company shown with a building icon.' },
    { name: 'location', type: 'string', description: 'Location shown with a pin icon.' },
    { name: 'skills', type: 'array', description: 'Skill pills (first 6 are shown).' },
    { name: 'kicker', type: 'string', default: "'Developer Credential'", description: 'Small label at the top of the card.' },
    { name: 'description', type: 'string', description: 'Bio shown on the flip side; enables the flip button.' },
    { name: 'link', type: 'string', default: "'#'", description: 'URL for the QR code and profile link.' },
    { name: 'className', type: 'string', description: 'Extra class names (merged).' },
    { name: '…rest', type: 'HTMLAttributes', description: 'Spread onto the card stage.' },
  ],
  'coder-profile-card': [
    { name: 'data', type: 'object', description: 'Profile object: { name, role, location, skills }.' },
    { name: 'fileName', type: 'string', default: "'code.js'", description: 'Filename shown in the editor tab.' },
    { name: 'className', type: 'string', description: 'Extra class names (merged).' },
    { name: '…rest', type: 'HTMLAttributes', description: 'Spread onto the card.' },
  ],
  'tech-orbit': [
    { name: 'skills', type: 'array', default: '[]', description: 'Skill names to render as orbiting chips (split across two rings).' },
    { name: 'title', type: 'string', default: "'Technologies I work with'", description: 'Heading above the orbit.' },
    { name: 'eyebrow', type: 'string', default: "'My Stack'", description: 'Small label above the title.' },
    { name: 'className', type: 'string', description: 'Extra class names (merged).' },
    { name: '…rest', type: 'HTMLAttributes', description: 'Spread onto the <section>.' },
  ],
  'github-activity': [
    { name: 'username', type: 'string', default: "'ajayakhanal'", description: 'GitHub username to load activity for.' },
    { name: 'years', type: 'number[]', default: '[2026, 2025, 2024, 2023]', description: 'Selectable years for the heatmap.' },
    { name: 'className', type: 'string', description: 'Extra class names (merged).' },
    { name: '…rest', type: 'HTMLAttributes', description: 'Spread onto the <section>.' },
  ],
  terminal: [
    { name: 'profile', type: 'object', description: 'The shell data: { user, path, shell, name, role, location, about, skills, links }.' },
    { name: 'className', type: 'string', description: 'Extra class names (merged).' },
    { name: '…rest', type: 'HTMLAttributes', description: 'Spread onto the terminal wrapper.' },
  ],
  'typing-text': [
    { name: 'content', type: 'array', required: true, description: 'Segments to type — strings or { text, className } objects.' },
    { name: 'speed', type: 'number', default: '40', description: 'Delay per character in ms.' },
    { name: 'className', type: 'string', default: "'typing-text'", description: 'Class for the wrapping paragraph.' },
    { name: 'id', type: 'string', default: "'default'", description: 'Unique id so the animation only plays once per session.' },
    { name: '…rest', type: 'HTMLAttributes', description: 'Spread onto the <p>.' },
  ],
}
