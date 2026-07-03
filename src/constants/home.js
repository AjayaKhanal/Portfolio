import { coderData } from './coder';

// Curated, defensible highlight metrics. Tweak the numbers as your work grows.
export const HOME_STATS = [
  { value: '3+', label: 'Years Coding' },
  { value: '10+', label: 'Projects Built' },
  { value: `${coderData.skills.length}`, label: 'Technologies' },
];

// Typed intro line for the hero — segments are strings or { text, className }
// objects (see the TypingText component).
export const HOME_TAGLINE = [
  'Focused on ',
  { text: 'Full Stack Development', className: 'dev' },
  ', building ',
  { text: 'scalable', className: 'skill' },
  ' and efficient ',
  { text: 'software solutions', className: 'skill' },
  ' with ',
  { text: 'clean architecture', className: 'skill' },
  '.',
];

// Rotating specialty phrases for the hero (react-type-animation sequence:
// string, pause-ms, string, pause-ms, …).
export const HOME_ROTATOR_SEQUENCE = [
  'Full Stack Development', 1800,
  'React Front-Ends', 1800,
  '.NET Back-Ends', 1800,
  'Clean, Scalable Code', 1800,
];
