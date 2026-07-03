import React from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ScrollToTop from '../components/ScrollToTop'
import DevModeOverlay from '../components/DevModeOverlay'
import { NAV_LINKS } from '../constants/navigation'
import { coderData } from '../constants/coder'
import { useDeveloperMode } from '../context/DeveloperModeContext'
import useScrollReveal from '../hooks/useScrollReveal'
import '../styles/reveal.css'

const Layout = ({children}) => {
  const location = useLocation();
  const { devMode } = useDeveloperMode();
  // Re-arm scroll reveals on every route change so each page animates in.
  useScrollReveal([location.pathname]);
  // The editor wants full-bleed width/height instead of the centered container.
  const isEditor = location.pathname === '/editor';
  // Hide developer-only links unless developer mode is on.
  const navLinks = NAV_LINKS.filter((link) => !link.devOnly || devMode);
  return (
    <>
    <ScrollToTop />
    <DevModeOverlay />
    <Header navLinks={navLinks} />
    {/* key by route so the entrance animation replays on each navigation */}
    <main
      className={`main page-transition${isEditor ? ' main--editor' : ''}`}
      key={location.pathname}
    >
      {children}
    </main>
    <Footer owner={coderData.name} />
    </>
  )
}

export default Layout