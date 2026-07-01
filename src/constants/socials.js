import { Github, Linkedin, Mail } from 'lucide-react'

// Single source of truth for social links — used by the hero, footer, contact
// page and anywhere else. Update a URL here and it changes everywhere.
export const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/', Icon: Github },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', Icon: Linkedin },
  { label: 'Email', href: 'mailto:ajayakhanal@example.com', Icon: Mail },
]
