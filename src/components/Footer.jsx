import React from 'react';
import SocialLinks from './SocialLinks';
import '../styles/footer.css'

const Footer = () => {
  return (
    <footer className='footer'>
      <SocialLinks as='div' className='footer-socials' linkClassName='footer-social' iconSize={20} />
      <p><span>&copy;</span> {new Date().getFullYear()} Ajaya Khanal</p>
    </footer>
  );
};

export default Footer;
