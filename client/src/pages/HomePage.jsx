import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { generatePoem, fetchArtworkByMood } from '../lib/api.js'
import PoemForm from '../components/PoemForm/PoemForm.jsx'
import LoadingState from '../components/LoadingState/LoadingState.jsx'
import ErrorState from '../components/ErrorState/ErrorState.jsx'
import styles from './HomePage.module.css'

export default function HomePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGenerate = async (style, mood) => {
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

      navigate('/result', {
        state: {
          poem: poemRes.value.poem,
          artwork: artworkRes.status === 'fulfilled' ? artworkRes.value : null,
          artworkError: artworkRes.status === 'rejected',
          style,
          mood,
        },
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      {loading && <LoadingState />}
      <header className={styles.header}>
        <h1 className={styles.title}>Verse &amp; Vision</h1>
        <p className={styles.subtitle}>
          Original verse in classical forms, paired with art from the Met.
        </p>
      </header>
      <main className={styles.main}>
        {error && <ErrorState message={error} onRetry={() => setError(null)} />}
        <PoemForm onSubmit={handleGenerate} loading={loading} />
      </main>
      <footer className={styles.attribution}>
        Photo by{' '}
        <a
          href="https://unsplash.com/@elou?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
          target="_blank"
          rel="noopener noreferrer"
        >
          Emily Campbell
        </a>
        {' '}on{' '}
        <a
          href="https://unsplash.com/photos/calm-blue-ocean-photography-yBq_CYFagvM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
          target="_blank"
          rel="noopener noreferrer"
        >
          Unsplash
        </a>
      </footer>
    </div>
  )
}
