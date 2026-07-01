import React from 'react'

/* Shared section heading (the underlined `.section-heading` style).
   `as` lets callers pick the heading level (h2 by default) for correct semantics. */
const SectionHeading = ({ children, as: Tag = 'h2', className = '', ...rest }) => (
  <Tag className={`section-heading${className ? ` ${className}` : ''}`} {...rest}>
    {children}
  </Tag>
)

export default SectionHeading
