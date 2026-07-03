import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Compass, ArrowLeft } from 'lucide-react'
import usePageMeta from '../utils/usePageMeta'
import '../styles/notFound.css'

const NotFound = () => {
  usePageMeta('Page Not Found', 'The page you are looking for could not be found.');
  const { pathname } = useLocation();

  return (
    <div className='notfound-page'>
      <div className='notfound-card anim-up'>
        <span className='notfound-icon' aria-hidden='true'>
          <Compass size={30} />
        </span>

        <p className='notfound-code'>404</p>
        <h1 className='notfound-title'>Page not found</h1>
        <p className='notfound-text'>
          Sorry, the page you're looking for doesn't exist or may have been moved.
        </p>

        {pathname && pathname !== '/' && (
          <p className='notfound-path'>
            <code>{pathname}</code>
          </p>
        )}

        <div className='notfound-actions'>
          <Link to='/home' className='notfound-btn notfound-btn--primary'>
            <ArrowLeft size={16} aria-hidden='true' />
            Back to Home
          </Link>
          <Link to='/projects' className='notfound-btn notfound-btn--ghost'>
            View Projects
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound
