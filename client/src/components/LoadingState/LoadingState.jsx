import { useState, useEffect } from 'react'
import styles from './LoadingState.module.css'

const MESSAGES = [
  'Summoning verses…',
  'Consulting the muses…',
  'Leafing through the stacks…',
  'Weighing each syllable…',
  'Searching the canon…',
]

export default function LoadingState() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length)
    }, 1800)
    return () => clearInterval(id)
  }, [])

  return (
    <div className={styles.overlay} role="status" aria-live="polite">
      <div className={styles.inner}>
        <div className={styles.inkDrop} aria-hidden="true" />
        <p className={styles.message}>{MESSAGES[index]}</p>
      </div>
    </div>
  )
}
