import React from 'react'
import '../styles/background.css'

/*
 * The app-wide layered backdrop, rendered once in Layout behind all content.
 * Layers (back to front): ambient aurora → top spotlight → dot grid → grain.
 * Purely decorative — see background.css for the visuals.
 */
const SiteBackground = () => (
  <div className="site-bg" aria-hidden="true">
    <div className="site-bg-aurora" />
    <div className="site-bg-spotlight" />
    <div className="site-bg-grid" />
    <div className="site-bg-noise" />
  </div>
)

export default SiteBackground
