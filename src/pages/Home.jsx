import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TypeAnimation } from 'react-type-animation'
import { Download, ArrowRight } from 'lucide-react'
import Button from '../components/Button'
import Terminal from '../components/Terminal'
import { CoderProfileCard } from '../components/Code'
import TechOrbit from '../components/TechOrbit'
import TypingText from '../components/TypingText'
import SocialLinks from '../components/SocialLinks'
import { coderData } from '../constants/coder'
import { HOME_STATS, HOME_TAGLINE, HOME_ROTATOR_SEQUENCE } from '../constants/home'
import { DEFAULT_TERMINAL_PROFILE } from '../constants/terminal'
import { useDeveloperMode } from '../context/DeveloperModeContext'
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
          <Button onClick={() => navigate('/projects')}>View Projects</Button>
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

const Home = () => {
  const navigate = useNavigate()
  const { devMode } = useDeveloperMode()
  usePageMeta(
    null,
    'Ajaya Khanal — Software Engineer building scalable, efficient software with clean architecture.'
  )

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
            sequence={HOME_ROTATOR_SEQUENCE}
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
          content={HOME_TAGLINE}
          speed={28}
          id="home-tagline"
          className="hero-tagline muted"
        />

        <div className="hero-actions">
          <Button onClick={() => navigate('/projects')}>View Projects</Button>
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

        <SocialLinks
          as="ul"
          className="hero-socials"
          linkClassName="hero-social"
          iconSize={20}
          withListItems
        />

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
          {HOME_STATS.map((s) => (
            <div key={s.label} className="hero-stat">
              <span className="hero-stat-value">{s.value}</span>
              <span className="hero-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="hero-code">
          {/* Developer mode reveals the interactive terminal; otherwise show
              the read-only code-profile card. */}
          {devMode ? (
            <Terminal profile={DEFAULT_TERMINAL_PROFILE} />
          ) : (
            <CoderProfileCard data={coderData} fileName="ajaya.js" />
          )}
        </div>
      </div>
    </section>

    <TechOrbit skills={coderData.skills} />
    </>
  )
}

export default Home
