export const MAX_GUESSES = 6

// The answer can be any real word between these lengths (inclusive). There is
// no curated answer list — words are fetched live (see fetchAnswer below).
export const MIN_LENGTH = 5
export const MAX_LENGTH = 7

// A tiny offline pool used ONLY when the random-word API can't be reached, so
// the game still starts with no network. Mixed lengths to match live play.
const OFFLINE = ['apple', 'ocean', 'planet', 'guitar', 'bridge', 'diamond', 'journey', 'harmony']

// Fetch a fresh random word (5–7 letters) to use as the answer. On any network
// error or malformed response we fall back to the offline pool so play never
// breaks. The board sizes itself to whatever length comes back.
export const fetchAnswer = async () => {
  const length = MIN_LENGTH + Math.floor(Math.random() * (MAX_LENGTH - MIN_LENGTH + 1))
  try {
    const res = await fetch(`https://random-word-api.vercel.app/api?words=1&length=${length}`)
    if (res.ok) {
      const [word] = await res.json()
      const w = String(word || '').toLowerCase()
      if (/^[a-z]+$/.test(w) && w.length >= MIN_LENGTH && w.length <= MAX_LENGTH) return w
    }
  } catch {
    /* offline — fall through to the emergency pool */
  }
  return OFFLINE[Math.floor(Math.random() * OFFLINE.length)]
}
