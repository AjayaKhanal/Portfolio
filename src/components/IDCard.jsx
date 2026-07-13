import React, { useRef, useState, useEffect } from 'react'
import { MapPin, Building2, Link as LinkIcon, RotateCw, ArrowLeft } from 'lucide-react'
import { cn } from '../lib/utils'
import '../styles/id-card.css'

const initials = (name) =>
  name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

const MAX_TILT = 12

const REST_TILT = {
  '--rx': '0deg',
  '--ry': '0deg',
  '--mx': '50%',
  '--my': '50%',
  '--active': '0',
}

const IDCard = React.forwardRef(({
  name = '',
  role = '',
  location,
  company,
  skills = [],
  kicker = 'Developer Credential',
  description,
  link = '#',
  className,
  ...rest
}, ref) => {
  const cardRef = useRef(null)
  const rafRef = useRef(null)
  const [flipped, setFlipped] = useState(false)

  // Write the tilt custom properties straight to the DOM node (batched into an
  // animation frame) so pointer movement never triggers a React re-render.
  const applyTilt = (vars) => {
    const el = cardRef.current
    if (!el) return
    for (const [prop, value] of Object.entries(vars)) {
      el.style.setProperty(prop, value)
    }
  }

  const handleMove = (e) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      applyTilt({
        '--rx': `${(0.5 - py) * MAX_TILT}deg`,
        '--ry': `${(px - 0.5) * MAX_TILT}deg`,
        '--mx': `${px * 100}%`,
        '--my': `${py * 100}%`,
        '--active': '1',
      })
    })
  }

  const handleLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    applyTilt(REST_TILT)
  }

  // Cancel any pending frame on unmount.
  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
  }, [])

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=0&data=${encodeURIComponent(
    link
  )}`

  return (
    <div ref={ref} className={cn('idcard-stage', className)} {...rest}>
      <div
        ref={cardRef}
        className="idcard-tilt"
        style={REST_TILT}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        <div className={`idcard-flip${flipped ? ' is-flipped' : ''}`}>
          {/* ---------------- Front ---------------- */}
          <div className="idcard-face idcard-face--front">
            <div className="idcard-glare" aria-hidden="true" />
            <div className="idcard-shine" aria-hidden="true" />

            <div className="idcard-header">
              <span className="idcard-kicker">{kicker}</span>
              <span className="idcard-status">
                <span className="idcard-status-dot" />
                Available
              </span>
            </div>

            <div className="idcard-body">
              <div className="idcard-avatar" aria-hidden="true">
                {initials(name)}
              </div>
              <div className="idcard-identity">
                <h3 className="idcard-name">{name}</h3>
                <p className="idcard-role">{role}</p>
                {company && (
                  <p className="idcard-company">
                    <Building2 size={14} aria-hidden="true" />
                    {company}
                  </p>
                )}
                {location && (
                  <p className="idcard-location">
                    <MapPin size={14} aria-hidden="true" />
                    {location}
                  </p>
                )}
              </div>
            </div>

            <div className="idcard-skills">
              {skills.slice(0, 6).map((skill) => (
                <span key={skill} className="idcard-skill">
                  {skill}
                </span>
              ))}
            </div>

            <div className="idcard-footer">
              <div className="idcard-meta">
                <span className="idcard-id">
                  ID · {initials(name)}-{new Date().getFullYear()}
                </span>
                <a className="idcard-link" href={link} target="_blank" rel="noopener noreferrer">
                  <LinkIcon size={14} aria-hidden="true" />
                  Scan or tap to connect
                </a>
              </div>
              <a
                className="idcard-qr"
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open profile link"
              >
                <img src={qrSrc} alt="QR code linking to profile" loading="lazy" />
              </a>
            </div>

            {description && (
              <button
                type="button"
                className="idcard-flip-btn"
                onClick={() => setFlipped(true)}
                aria-label="Flip card to read more"
              >
                <RotateCw size={15} aria-hidden="true" />
                Read more
              </button>
            )}
          </div>

          {/* ---------------- Back ---------------- */}
          <div className="idcard-face idcard-face--back">
            <div className="idcard-header">
              <span className="idcard-kicker">About {name}</span>
              <span className="idcard-status">
                <span className="idcard-status-dot" />
                {role}
              </span>
            </div>

            <div className="idcard-back-body">
              <p className="idcard-description">{description}</p>
            </div>

            <button
              type="button"
              className="idcard-flip-btn idcard-flip-btn--back"
              onClick={() => setFlipped(false)}
              aria-label="Flip card back"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
})

IDCard.displayName = 'IDCard'

export default IDCard
