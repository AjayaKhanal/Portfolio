import React from 'react'
import { cva } from '../lib/utils'

const heading = cva('section-heading', {
  variants: {
    size: {
      sm: 'section-heading--sm',
      md: '',
      lg: 'section-heading--lg',
    },
  },
  defaultVariants: { size: 'md' },
})

/**
 * SectionHeading — the underlined `.section-heading` used across the app.
 *
 *   <SectionHeading>Projects</SectionHeading>
 *   <SectionHeading as="h3" size="sm">Details</SectionHeading>
 *
 * `as` picks the heading level (h2 by default) for correct semantics.
 * Forwards its ref to the heading element and spreads extra props onto it.
 */
const SectionHeading = React.forwardRef(
  ({ children, as: Tag = 'h2', size, className, ...rest }, ref) => (
    <Tag ref={ref} className={heading({ size, className })} {...rest}>
      {children}
    </Tag>
  )
)

SectionHeading.displayName = 'SectionHeading'

export default SectionHeading
