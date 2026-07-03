import { useState, useRef, useEffect, forwardRef } from 'react'
import { cn } from '../lib/utils'
import { ReactComponent as SearchIcon } from '../assets/search-icon.svg'
import { ReactComponent as ClearIcon } from '../assets/clear-icon.svg'
import '../styles/searchbar.css'

/**
 * SearchBar — a debounced search input.
 *
 *   <SearchBar onSearch={setQuery} placeholder="Search projects…" />
 *
 * - `onSearch(value)` fires (debounced) as the user types, on Enter, and on clear.
 * - `defaultValue` seeds the initial text; `debounce` is the delay in ms.
 * - Forwards its ref to the <input> and spreads extra props onto it.
 */
const SearchBar = forwardRef(
  (
    {
      defaultValue = '',
      placeholder = 'Search…',
      onSearch,
      debounce = 500,
      className,
      ...rest
    },
    ref
  ) => {
    const [query, setQuery] = useState(defaultValue)
    const debounceTimer = useRef(null)

    // Debounced search on typing.
    useEffect(() => {
      clearTimeout(debounceTimer.current)
      debounceTimer.current = setTimeout(() => {
        onSearch?.(query.trim())
      }, debounce)
      return () => clearTimeout(debounceTimer.current)
    }, [query, onSearch, debounce])

    const handleSearch = () => {
      if (query.trim() === '') return
      onSearch?.(query.trim())
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && query.trim() !== '') handleSearch()
    }

    const handleClear = () => {
      setQuery('')
      onSearch?.('')
    }

    return (
      <div className={cn('search-bar-wrapper', className)}>
        <input
          ref={ref}
          type="text"
          className="search-bar"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          {...rest}
        />

        {query && (
          <button className="clear-icon" onClick={handleClear} aria-label="Clear search">
            <ClearIcon className="clear-svg" />
          </button>
        )}

        <button
          className="search-icon"
          onClick={handleSearch}
          disabled={query.trim() === ''}
          aria-label="Search"
        >
          <SearchIcon className="search-svg" />
        </button>
      </div>
    )
  }
)

SearchBar.displayName = 'SearchBar'

export default SearchBar
