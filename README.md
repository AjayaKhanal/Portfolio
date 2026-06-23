# Ajaya Khanal — Portfolio

A personal portfolio website built with React, showcasing projects, skills, and
experience. Features a light/dark theme, animated page transitions, and
MDX-powered project pages.

## ✨ Features

- **Home, About, Projects, Contact** pages with a responsive layout
- **Light / Dark / System** theme switcher (persisted via `next-themes`)
- **MDX-driven projects** — each project is a single `.mdx` file that powers both
  the preview card and the full detail page
- **Search & pagination** on the projects page, plus **filtering by tech tag**
- **Animated transitions** throughout, with a `prefers-reduced-motion` fallback
- **Contact form** with client-side validation
- **SEO**: per-page titles/descriptions, Open Graph & Twitter cards, JSON-LD
  structured data, `sitemap.xml`, and `robots.txt`
- **Graceful errors**: custom 404 page and a global error boundary

## 🛠 Tech Stack

- [React 19](https://react.dev/) (Create React App + [CRACO](https://craco.js.org/))
- [React Router 7](https://reactrouter.com/)
- [MDX](https://mdxjs.com/) for project content
- [next-themes](https://github.com/pacocoursey/next-themes) for theming
- [lucide-react](https://lucide.dev/) icons
- Tailwind CSS (configured) + plain CSS per component

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start the dev server (http://localhost:3000)
npm start

# Create a production build
npm run build

# Run tests
npm test
```

## 📁 Project Structure

```
public/                 # Static assets, index.html, SEO files, SPA redirects
src/
├── assets/             # SVG icons
├── components/         # Reusable UI (Header, Footer, ProjectCard, ThemeSwitcher…)
├── data/projects/      # One .mdx file per project (exports `meta` + content)
├── lib/                # Helpers and code-block data
├── pages/              # Route pages (Home, About, Projects, ProjectDetail, Contact, NotFound)
├── styles/             # Component/page stylesheets
├── utils/              # mdx utilities, usePageMeta hook
├── App.js              # App shell + ErrorBoundary
└── routes.js           # Route definitions
```

## 📝 Adding a Project

Create a new file in `src/data/projects/`, e.g. `MyProject.mdx`:

```mdx
export const meta = {
  title: "My Project",
  description: "Short summary shown on the card and detail page.",
  image: "/images/my-project.png",
  techStack: ["React", "Node", "SQL"],
  githubLink: "https://github.com/you/my-project",
  liveDemo: "https://my-project.com",
};

# My Project

Markdown content for the detail page…
```

The file name becomes the URL slug (`/projects/MyProject`). Project images go in
`public/images/`. Leave `githubLink` / `liveDemo` empty (`""`) to hide those
buttons.

## 🌐 Deployment

This is a single-page app using `BrowserRouter`, so the host must rewrite all
routes to `index.html`. Configs are included:

- **Netlify** — `public/_redirects`
- **Vercel** — `vercel.json`

Before deploying, replace the `https://your-domain.com` placeholders in
`public/sitemap.xml`, `public/robots.txt`, and the JSON-LD block in
`public/index.html` with your real URL.

## ⚙️ Configuration Notes

- Tailwind theme tokens currently live directly under `extend` in
  `tailwind.config.js`; move them under `extend.colors` if you want
  `bg-*`/`text-*` color utilities to generate.
- Update placeholder content (contact email/phone, social URLs, and each
  project's links/images) with your real information before going live.

---

© Ajaya Khanal
