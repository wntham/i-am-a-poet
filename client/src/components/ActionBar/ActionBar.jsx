import styles from './ActionBar.module.css'

export default function ActionBar({ onRegenerate, onSave, onShare, copied }) {
  return (
    <div className={styles.bar} role="toolbar" aria-label="Poem actions">
      {onRegenerate && (
        <button className={styles.btn} onClick={onRegenerate} title="Generate a new poem with the same settings">
          Regenerate
        </button>
      )}
      <button className={styles.btn} onClick={onSave} title="Download as PNG image">
        Save as image
      </button>
      <button className={`${styles.btn} ${copied ? styles.copied : ''}`} onClick={onShare} title="Copy share link to clipboard">
        {copied ? 'Link copied!' : 'Share'}
      </button>
    </div>
  )
}
