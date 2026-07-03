import React from 'react'
import { cn } from '../lib/utils'
import { SOCIAL_LINKS } from '../constants/socials'

/*
 * SocialLinks — renders a set of social links from shared data.
 * Flexible enough to cover the different looks across the app:
 *  - `variant="icon"` shows the lucide icon; `variant="text"` shows the label.
 *  - `as` sets the container element (ul / div), `withListItems` wraps each
 *    link in an <li> (for list-based layouts like the hero).
 *  - `items` lets a caller pass a subset (e.g. omit Email on the contact page).
 */
const SocialLinks = React.forwardRef(({
  as: Container = 'ul',
  variant = 'icon',
  className,
  linkClassName = '',
  iconSize = 20,
  items = SOCIAL_LINKS,
  withListItems = false,
  ariaLabel = 'Social links',
  ...rest
}, ref) => {
  return (
    <Container ref={ref} className={cn(className)} aria-label={ariaLabel} {...rest}>
      {items.map(({ label, href, Icon }) => {
        const isMail = href.startsWith('mailto:')
        const link = (
          <a
            key={label}
            className={linkClassName}
            href={href}
            target={isMail ? undefined : '_blank'}
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
          >
            {variant === 'icon' ? <Icon size={iconSize} aria-hidden="true" /> : label}
          </a>
        )
        return withListItems ? <li key={label}>{link}</li> : link
      })}
    </Container>
  )
})

SocialLinks.displayName = 'SocialLinks'

export default SocialLinks
