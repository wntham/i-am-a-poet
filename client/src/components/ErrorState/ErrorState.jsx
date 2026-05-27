import styles from './ErrorState.module.css'

export default function ErrorState({ message, onRetry }) {
  return (
    <div className={styles.error} role="alert">
      <span className={styles.icon} aria-hidden="true">!</span>
      <div className={styles.content}>
        <p className={styles.message}>{message || 'Something went wrong.'}</p>
        {onRetry && (
          <button className={styles.retry} onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    </div>
  )
}
