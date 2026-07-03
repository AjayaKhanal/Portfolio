import { coderData } from './coder';

// Default profile the interactive Terminal displays. Pass a `profile` prop to
// the component to override any of these keys.
export const DEFAULT_TERMINAL_PROFILE = {
  user: 'ajaya@portfolio',
  path: '~',
  shell: 'zsh',
  name: coderData.name,
  role: coderData.role,
  location: coderData.location,
  about: 'Building scalable, efficient software with clean architecture.',
  skills: coderData.skills,
  links: [
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'Email', href: 'mailto:ajayakhanal@example.com' },
  ],
};
