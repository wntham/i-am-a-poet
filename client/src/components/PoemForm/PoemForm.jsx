import { useState } from 'react'
import { STYLE_OPTIONS, MOOD_OPTIONS } from '../../lib/constants.js'
import styles from './PoemForm.module.css'

export default function PoemForm({ onSubmit, loading }) {
  const [style, setStyle] = useState('')
  const [mood, setMood] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (style && mood) onSubmit(style, mood)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-label="Poetry generator">
      <div className={styles.field}>
        <label htmlFor="style" className={styles.label}>Style</label>
        <select
          id="style"
          className={styles.select}
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          required
          aria-required="true"
        >
          <option value="" disabled>Choose a style…</option>
          {STYLE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="mood" className={styles.label}>Mood</label>
        <select
          id="mood"
          className={styles.select}
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          required
          aria-required="true"
        >
          <option value="" disabled>Choose a mood…</option>
          {MOOD_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className={styles.submit}
        disabled={!style || !mood || loading}
        aria-busy={loading}
      >
        {loading ? 'Generating…' : 'Generate poem'}
      </button>
    </form>
  )
}
