import React from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ScrollToTop from '../components/ScrollToTop'
import { ThemeProvider } from '../components/ThemeProvider'

const Layout = ({children}) => {
  const location = useLocation();
  return (
    <>
    <ThemeProvider defaultTheme='system' enableSystem attribute='class' disableTransitionOnChange>
    <ScrollToTop />
    <Header></Header>
    {/* key by route so the entrance animation replays on each navigation */}
    <main className='main page-transition' key={location.pathname}>{children}</main>
    <Footer></Footer>
    </ThemeProvider>
    </>
  )
}

export default Layout