import React from 'react'
import { Link } from 'react-router-dom'
import usePageMeta from '../utils/usePageMeta'
import '../styles/notFound.css'

const NotFound = () => {
  usePageMeta('Page Not Found', 'The page you are looking for could not be found.');
  return (
    <div className='notfound-page'>
      <div className='notfound-content anim-up'>
        <p className='notfound-code'>404</p>
        <h1 className='notfound-title'>Page Not Found</h1>
        <p className='notfound-text'>
          Sorry, the page you are looking for doesn't exist or may have been moved.
        </p>
        <div className='notfound-actions'>
          <Link to='/home' className='notfound-btn notfound-btn--primary'>Back to Home</Link>
          <Link to='/projects' className='notfound-btn notfound-btn--ghost'>View Projects</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound
