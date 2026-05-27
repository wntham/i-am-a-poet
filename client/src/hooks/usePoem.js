import { useState, useCallback } from 'react'
import { generatePoem, fetchArtworkByMood } from '../lib/api.js'

export function usePoem() {
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [poem, setPoem] = useState(null)
  const [artwork, setArtwork] = useState(null)
  const [artworkError, setArtworkError] = useState(false)
  const [error, setError] = useState(null)
  const [lastParams, setLastParams] = useState(null)

  const generate = useCallback(async (style, mood) => {
    setStatus('loading')
    setError(null)
    setArtworkError(false)
    setLastParams({ style, mood })

    try {
      const [poemData, artworkData] = await Promise.allSettled([
        generatePoem(style, mood),
        fetchArtworkByMood(mood),
      ])

      if (poemData.status === 'rejected') {
        throw new Error(poemData.reason?.message || 'Failed to generate poem')
      }

      setPoem(poemData.value.poem)

      if (artworkData.status === 'rejected') {
        setArtworkError(true)
        setArtwork(null)
      } else {
        setArtwork(artworkData.value)
      }

      setStatus('success')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }, [])

  const regenerate = useCallback(() => {
    if (lastParams) {
      generate(lastParams.style, lastParams.mood)
    }
  }, [lastParams, generate])

  return { status, poem, artwork, artworkError, error, lastParams, generate, regenerate }
}
