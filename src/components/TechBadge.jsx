import React from 'react'

/* A single tech/skill badge — shared by project cards and the detail page. */
const TechBadge = ({ tech, className = '' }) => (
  <span className={`tech-badge${className ? ` ${className}` : ''}`}>{tech}</span>
)

export default TechBadge
