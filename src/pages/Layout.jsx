import React from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ScrollToTop from '../components/ScrollToTop'
import { ThemeProvider } from '../components/ThemeProvider'
import useScrollReveal from '../hooks/useScrollReveal'
import '../styles/reveal.css'

const Layout = ({children}) => {
  const location = useLocation();
  // Re-arm scroll reveals on every route change so each page animates in.
  useScrollReveal([location.pathname]);
  // The editor wants full-bleed width/height instead of the centered container.
  const isEditor = location.pathname === '/editor';
  return (
    <>
    <ThemeProvider defaultTheme='system' enableSystem attribute='class' disableTransitionOnChange>
    <ScrollToTop />
    <Header></Header>
    {/* key by route so the entrance animation replays on each navigation */}
    <main
      className={`main page-transition${isEditor ? ' main--editor' : ''}`}
      key={location.pathname}
    >
      {children}
    </main>
    <Footer></Footer>
    </ThemeProvider>
    </>
  )
}

export default Layout