import React from 'react'
import { cn } from '../lib/utils'

/**
 * Pagination — numbered page controls. Renders nothing when there's one page.
 *
 *   <Pagination current={page} total={6} onPageChange={setPage} />
 *
 * Forwards its ref to the wrapper and spreads extra props onto it.
 */
const Pagination = React.forwardRef(({ current, total, onPageChange, className, ...rest }, ref) => {
  if (total <= 1) return null
  const pages = Array.from({ length: total }, (_, i) => i + 1)
  return (
    <div ref={ref} className={cn('pagination', className)} {...rest}>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(page === current && 'active')}
          aria-current={page === current ? 'page' : undefined}
        >
          {page}
        </button>
      ))}
    </div>
  )
})

Pagination.displayName = 'Pagination'

export default Pagination
