import React from 'react'
import {
  SiSharp,
  SiDotnet,
  SiReact,
  SiJavascript,
  SiCss,
  SiHtml5,
  SiGit,
  SiGithub,
} from 'react-icons/si'
import { FaDatabase } from 'react-icons/fa'
import { coderData } from './CodeBlock'
import '../styles/tech-orbit.css'

const ICONS = {
  'C#': { Icon: SiSharp, color: '#a179dc' },
  Dotnet: { Icon: SiDotnet, color: '#7c4dff' },
  SQL: { Icon: FaDatabase, color: '#3fa9f5' },
  React: { Icon: SiReact, color: '#61dafb' },
  JavaScript: { Icon: SiJavascript, color: '#f7df1e' },
  CSS: { Icon: SiCss, color: '#663399' },
  GitHub: { Icon: SiGithub, color: '#e6edf3' },
  HTML: { Icon: SiHtml5, color: '#e34f26' },
  Git: { Icon: SiGit, color: '#f05032' },
}

const splitRings = (skills) => {
  const innerCount = Math.min(4, Math.ceil(skills.length / 2))
  return {
    inner: skills.slice(0, innerCount),
    outer: skills.slice(innerCount),
  }
}

const Ring = ({ skills, variant }) => (
  <div className={`orbit-ring orbit-ring--${variant}`}>
    {skills.map((skill, i) => {
      const angle = (360 / skills.length) * i
      const meta = ICONS[skill] || { Icon: FaDatabase, color: '#8b949e' }
      const { Icon, color } = meta
      return (
        <div key={skill} className="orbit-node" style={{ '--angle': `${angle}deg` }}>
          <div className={`orbit-node-spin orbit-node-spin--${variant}`}>
            <div className="orbit-node-upright" style={{ '--angle': `${angle}deg` }}>
              <span className="orbit-chip" title={skill} style={{ '--chip-color': color }}>
                <Icon className="orbit-icon" aria-hidden="true" />
                <span className="orbit-label">{skill}</span>
              </span>
            </div>
          </div>
        </div>
      )
    })}
  </div>
)

const TechOrbit = () => {
  const { inner, outer } = splitRings(coderData.skills)

  return (
    <section className="tech-orbit-section" aria-label="Tech stack">
      <div className="tech-orbit-head">
        <span className="tech-orbit-eyebrow">My Stack</span>
        <h2 className="tech-orbit-title">Technologies I work with</h2>
      </div>

      <div className="tech-orbit" role="img" aria-label={`Tech stack: ${coderData.skills.join(', ')}`}>
        <div className="orbit-track orbit-track--inner" aria-hidden="true" />
        <div className="orbit-track orbit-track--outer" aria-hidden="true" />

        <div className="orbit-core">
          <span className="orbit-core-glyph">&lt;/&gt;</span>
        </div>

        <Ring skills={inner} variant="inner" />
        <Ring skills={outer} variant="outer" />
      </div>
    </section>
  )
}

export default TechOrbit
