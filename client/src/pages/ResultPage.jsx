import { useRef, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { generatePoem, fetchArtworkByMood, fetchArtworkById } from '../lib/api.js'
import { decodeShare } from '../lib/share.js'
import { useShare } from '../hooks/useShare.js'
import { useExport } from '../hooks/useExport.js'
import ResultCard from '../components/ResultCard/ResultCard.jsx'
import ActionBar from '../components/ActionBar/ActionBar.jsx'
import LoadingState from '../components/LoadingState/LoadingState.jsx'
import ErrorState from '../components/ErrorState/ErrorState.jsx'
import styles from './ResultPage.module.css'

export default function ResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const cardRef = useRef(null)
  const { share, copied } = useShare()
  const { exportImage } = useExport()

  const [poem, setPoem] = useState(null)
  const [artwork, setArtwork] = useState(null)
  const [artworkError, setArtworkError] = useState(false)
  const [style, setStyle] = useState(null)
  const [mood, setMood] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const decoded = decodeShare(location.search)

    if (decoded) {
      // Reconstruct from share link
      setPoem(decoded.poem)
      setLoading(true)
      fetchArtworkById(decoded.objectID)
        .then((art) => {
          setArtwork(art)
          setArtworkError(false)
        })
        .catch(() => setArtworkError(true))
        .finally(() => setLoading(false))
      return
    }

    // Populate from navigation state
    const s = location.state
    if (s?.poem) {
      setPoem(s.poem)
      setArtwork(s.artwork)
      setArtworkError(s.artworkError ?? false)
      setStyle(s.style)
      setMood(s.mood)
    } else {
      navigate('/', { replace: true })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleRegenerate = async () => {
    if (!style || !mood) return
    setLoading(true)
    setError(null)

    try {
      const [poemRes, artworkRes] = await Promise.allSettled([
        generatePoem(style, mood),
        fetchArtworkByMood(mood),
      ])

      if (poemRes.status === 'rejected') {
        throw new Error(poemRes.reason?.message || 'Failed to generate poem')
      }

      setPoem(poemRes.value.poem)
      if (artworkRes.status === 'fulfilled') {
        setArtwork(artworkRes.value)
        setArtworkError(false)
      } else {
        setArtworkError(true)
        setArtwork(null)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!poem && !loading) return null

  return (
    <div className={styles.page}>
      {loading && <LoadingState />}
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')} aria-label="Back to form">
          ← New poem
        </button>
      </header>
      <main className={styles.main}>
        {error && <ErrorState message={error} onRetry={handleRegenerate} />}
        {poem && (
          <>
            <ResultCard
              ref={cardRef}
              poem={poem}
              artwork={artwork}
              artworkError={artworkError}
              style={style}
              mood={mood}
            />
            <ActionBar
              onRegenerate={style && mood ? handleRegenerate : null}
              onSave={() => exportImage(cardRef, style || 'poem', mood || 'verse')}
              onShare={() => share(poem, artwork?.objectID)}
              copied={copied}
            />
          </>
        )}
      </main>
    </div>
  )
}
