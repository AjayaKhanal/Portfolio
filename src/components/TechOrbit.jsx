import React from 'react'
import { cn } from '../lib/utils'
import { TECH_ICONS, TECH_ICON_FALLBACK } from '../constants/techOrbit'
import '../styles/tech-orbit.css'

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
      const meta = TECH_ICONS[skill] || TECH_ICON_FALLBACK
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

const TechOrbit = React.forwardRef(({
  skills = [],
  title = 'Technologies I work with',
  eyebrow = 'My Stack',
  className,
  ...rest
}, ref) => {
  const { inner, outer } = splitRings(skills)

  return (
    <section ref={ref} className={cn('tech-orbit-section', className)} aria-label="Tech stack" {...rest}>
      <div className="tech-orbit-head" data-reveal="up">
        <span className="tech-orbit-eyebrow">{eyebrow}</span>
        <h2 className="tech-orbit-title">{title}</h2>
      </div>

      <div className="tech-orbit" data-reveal="scale" role="img" aria-label={`Tech stack: ${skills.join(', ')}`}>
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
})

TechOrbit.displayName = 'TechOrbit'

export default TechOrbit
