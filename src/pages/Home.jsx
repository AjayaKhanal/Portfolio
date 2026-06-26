import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TypeAnimation } from 'react-type-animation'
import { Github, Linkedin, Mail, Download, ArrowRight } from 'lucide-react'
import Button from '../components/Button'
import Terminal from '../components/Terminal'
import TechOrbit from '../components/TechOrbit'
import TypingText from '../components/TypingText'
import { coderData } from '../components/CodeBlock'
import usePageMeta from '../utils/usePageMeta'
import '../styles/home.css'

/* =============================================================================
   LEGACY HOME (v1) — preserved for easy rollback.
   To restore: delete the new `Home` component below and uncomment this block.
   -----------------------------------------------------------------------------
const Home = () => {
  const navigate = useNavigate();
  usePageMeta(null, 'Ajaya Khanal — Software Engineer building scalable, efficient software with clean architecture.');

  const content = [
    'Focused in ',
    { text: 'Full Stack Development', className: 'dev' },
    ', building ',
    { text: 'scalable', className: 'skill' },
    ' and efficient ',
    { text: 'software solutions', className: 'skill' },
    ' with ',
    { text: 'clean architecture', className: 'skill' },
    ' and ',
    { text: 'robust performance.', className: 'skill' }
  ];

  return (
    <div className='home'>
      <div className='profile fade-in-left'>
        <h2>Ajaya Khanal</h2>
        <p className='profile-role'>Software Engineer</p>
        <TypingText content={content} speed={30} className='muted typing-text' />
        <div className='profile-actions'>
          <Button text="View Projects" onclick={() => navigate('/projects')} />
          <Link to='/contact' className='button button--ghost'>Contact Me</Link>
        </div>
      </div>

      <div className='code fade-in-right'>
        <CodeProfile />
      </div>
    </div>
  )
}

export default Home
============================================================================= */

// Curated, defensible highlight metrics. Tweak the numbers as your work grows.
const STATS = [
  { value: '3+', label: 'Years Coding' },
  { value: '10+', label: 'Projects Built' },
  { value: `${coderData.skills.length}`, label: 'Technologies' },
]

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/', Icon: Github },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', Icon: Linkedin },
  { label: 'Email', href: 'mailto:ajayakhanal@example.com', Icon: Mail },
]

const Home = () => {
  const navigate = useNavigate()
  usePageMeta(
    null,
    'Ajaya Khanal — Software Engineer building scalable, efficient software with clean architecture.'
  )

  // Typed intro line — re-uses the existing TypingText component & .dev/.skill styles.
  const taglineContent = [
    'Focused on ',
    { text: 'Full Stack Development', className: 'dev' },
    ', building ',
    { text: 'scalable', className: 'skill' },
    ' and efficient ',
    { text: 'software solutions', className: 'skill' },
    ' with ',
    { text: 'clean architecture', className: 'skill' },
    '.',
  ]

  return (
    <>
    <section className="home-hero" aria-label="Introduction">
      {/* Decorative background glows. The box-grid is now global (background.css). */}
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-glow hero-glow--one" />
        <div className="hero-glow hero-glow--two" />
      </div>

      {/* ---------- Left: identity, pitch, actions ---------- */}
      <div className="hero-content" data-reveal="left">
        <span className="hero-status">
          <span className="hero-status-dot" />
          Available for new opportunities
        </span>

        <p className="hero-eyebrow">Hi, I’m</p>

        <h1 className="hero-name">Ajaya Khanal</h1>

        <h2 className="hero-role">Software Engineer</h2>

        {/* Dynamic specialty rotator (decorative — static equivalent below for AT) */}
        <p className="hero-rotator-line" aria-hidden="true">
          <span className="hero-rotator-prefix">Specializing in&nbsp;</span>
          <TypeAnimation
            sequence={[
              'Full Stack Development', 1800,
              'React Front-Ends', 1800,
              '.NET Back-Ends', 1800,
              'Clean, Scalable Code', 1800,
            ]}
            wrapper="span"
            speed={45}
            repeat={Infinity}
            className="hero-rotator"
          />
        </p>
        <span className="sr-only">
          Software Engineer specializing in full stack development with React and .NET.
        </span>

        <TypingText
          content={taglineContent}
          speed={28}
          id="home-tagline"
          className="hero-tagline muted"
        />

        <div className="hero-actions">
          <Button text="View Projects" onclick={() => navigate('/projects')} />
          {/* Drop your CV at public/resume.pdf to wire up this download. */}
          <a className="hero-btn hero-btn--ghost" href="/resume.pdf" download>
            <Download size={18} aria-hidden="true" />
            Download Résumé
          </a>
          <Link className="hero-btn hero-btn--ghost" to="/contact">
            Contact
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <ul className="hero-socials" aria-label="Social links">
          {SOCIALS.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                className="hero-social"
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
              >
                <Icon size={20} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>

        {/* <div className="hero-tech">
          <span className="hero-tech-label">Tech I work with</span>
          <ul className="hero-chips">
            {coderData.skills.map((tech) => (
              <li key={tech} className="hero-chip">{tech}</li>
            ))}
          </ul>
        </div> */}
      </div>

      {/* ---------- Right: stats + code-card profile presentation ---------- */}
      <div className="hero-visual" data-reveal="right">
        <div className="hero-visual-glow" aria-hidden="true" />
        <div className="hero-stats" aria-label="Highlights">
          {STATS.map((s) => (
            <div key={s.label} className="hero-stat">
              <span className="hero-stat-value">{s.value}</span>
              <span className="hero-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="hero-code">
          <Terminal />
        </div>
      </div>
    </section>

    <TechOrbit />
    </>
  )
}

export default Home
