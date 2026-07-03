import React from 'react'
import { cva } from '../lib/utils'

const badge = cva('tech-badge', {
  variants: {
    variant: {
      default: '',
      more: 'tech-badge--more',
    },
  },
  defaultVariants: { variant: 'default' },
})

/**
 * TechBadge — a small pill for a tech/skill label.
 *
 *   <TechBadge>React</TechBadge>
 *   <TechBadge variant="more">+3</TechBadge>
 *
 * Forwards its ref to the <span> and spreads extra props onto it.
 */
const TechBadge = React.forwardRef(({ children, variant, className, ...rest }, ref) => (
  <span ref={ref} className={badge({ variant, className })} {...rest}>
    {children}
  </span>
))

TechBadge.displayName = 'TechBadge'

export default TechBadge
