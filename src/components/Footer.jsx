import React from 'react';
import SocialLinks from './SocialLinks';
import { cn } from '../lib/utils';
import '../styles/footer.css'

const Footer = React.forwardRef(({ owner = '', className, ...rest }, ref) => {
  return (
    <footer ref={ref} className={cn('footer', className)} {...rest}>
      <SocialLinks as='div' className='footer-socials' linkClassName='footer-social' iconSize={20} />
      <p><span>&copy;</span> {new Date().getFullYear()} {owner}</p>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
