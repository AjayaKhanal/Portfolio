import { useEffect } from 'react'

/*
 * useScrollReveal
 * ---------------
 * Gives the site a "load on scroll" feel: anything already within the first
 * screen is shown immediately, while elements below the fold start hidden and
 * animate in as they scroll into view.
 *
 * Design (deliberately fail-safe):
 * - Elements are VISIBLE by default in CSS. JS only *adds* `reveal-hidden` to
 *   elements that are currently below the fold. So if the JS ever fails or an
 *   element is missed, it simply stays visible — it can never go blank.
 * - StrictMode-safe: no persistent flags on DOM nodes; each effect run tracks
 *   its own elements, so the dev double-invoke can't wedge the observer.
 * - A MutationObserver catches async content (fetched projects, GitHub widget,
 *   lazy MDX bodies).
 * - `prefers-reduced-motion` / no IntersectionObserver → nothing is ever hidden.
 */
const REVEAL_SELECTOR = '[data-reveal]'

const collect = (root) => {
  const found = []
  if (root.matches && root.matches(REVEAL_SELECTOR)) found.push(root)
  if (root.querySelectorAll) found.push(...root.querySelectorAll(REVEAL_SELECTOR))
  return found
}

const show = (el) => el.classList.remove('reveal-hidden')

export default function useScrollReveal(deps = []) {
  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const noObserver = typeof IntersectionObserver === 'undefined'

    // Fallback: never hide anything; make sure nothing is left hidden.
    if (prefersReduced || noObserver) {
      const showAll = (root) => collect(root).forEach(show)
      showAll(document)
      const mo = new MutationObserver((mutations) =>
        mutations.forEach((m) =>
          m.addedNodes.forEach((n) => n.nodeType === 1 && showAll(n))
        )
      )
      mo.observe(document.body, { childList: true, subtree: true })
      return () => mo.disconnect()
    }

    const tracked = new WeakSet()

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            show(entry.target)
            io.unobserve(entry.target)
          }
        }),
      // Reveal as soon as any part scrolls in (a touch before the bottom edge).
      { threshold: 0, rootMargin: '0px 0px -10% 0px' }
    )

    const setup = (el) => {
      if (tracked.has(el)) return
      tracked.add(el)
      const viewportH = window.innerHeight || document.documentElement.clientHeight
      // Only hide what's actually below the fold; visible content stays visible.
      if (el.getBoundingClientRect().top >= viewportH) {
        el.classList.add('reveal-hidden')
        io.observe(el)
      }
    }

    const setupAll = (root) => collect(root).forEach(setup)
    setupAll(document)

    // Catch elements that mount after the first paint (async data, etc.).
    const mo = new MutationObserver((mutations) =>
      mutations.forEach((m) =>
        m.addedNodes.forEach((n) => n.nodeType === 1 && setupAll(n))
      )
    )
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
