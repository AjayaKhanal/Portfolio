import React from 'react'
import { cn } from '../lib/utils'

/**
 * Pagination — numbered page controls. Renders nothing when there's one page.
 *
 *   <Pagination current={page} total={6} onPageChange={setPage} />
 *
 * Forwards its ref to the wrapper and spreads extra props onto it.
 */
// Build the visible page list: always the first and last page, the current page
// with its immediate neighbours, and '…' markers standing in for the gaps.
const buildPages = (current, total) => {
  const pages = []
  for (let page = 1; page <= total; page++) {
    if (page === 1 || page === total || (page >= current - 1 && page <= current + 1)) {
      pages.push(page)
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…')
    }
  }
  return pages
}

const Pagination = React.forwardRef(({ current, total, onPageChange, className, ...rest }, ref) => {
  if (total <= 1) return null
  const pages = buildPages(current, total)
  return (
    <div ref={ref} className={cn('pagination', className)} {...rest}>
      {pages.map((page, i) =>
        page === '…' ? (
          <span key={`ellipsis-${i}`} className="pagination-ellipsis" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(page === current && 'active')}
            aria-current={page === current ? 'page' : undefined}
          >
            {page}
          </button>
        )
      )}
    </div>
  )
})

Pagination.displayName = 'Pagination'

export default Pagination
