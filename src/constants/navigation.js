// Primary navigation links rendered in the header.
// `devOnly` links only appear (and their routes only open) in developer mode.
export const NAV_LINKS = [
  { to: '/home', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/games', label: 'Games' },
  { to: '/components', label: 'Components', devOnly: true },
  { to: '/editor', label: 'Editor', devOnly: true },
  { to: '/contact', label: 'Contact' },
];
