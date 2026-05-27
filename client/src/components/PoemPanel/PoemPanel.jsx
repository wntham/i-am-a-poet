import styles from './PoemPanel.module.css'

export default function PoemPanel({ poem, style, mood }) {
  const metaText = style && mood
    ? `${style.charAt(0).toUpperCase()}${style.slice(1).toLowerCase()}, ${mood.toLowerCase()}`
    : null

  return (
    <div className={styles.panel}>
      <pre className={styles.poem}>{poem}</pre>
      {metaText && <p className={styles.meta}>{metaText}</p>}
    </div>
  )
}
