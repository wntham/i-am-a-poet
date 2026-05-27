import styles from './ArtworkPanel.module.css'

export default function ArtworkPanel({ artwork, error }) {
  if (error) {
    return (
      <div className={styles.panel}>
        <div className={styles.placeholder}>
          <p>Artwork unavailable</p>
        </div>
      </div>
    )
  }

  if (!artwork) return null

  return (
    <div className={styles.panel}>
      <div className={styles.imageWrapper}>
        <img
          src={artwork.imageUrl}
          alt={`${artwork.title} by ${artwork.artist}`}
          className={styles.image}
          crossOrigin="anonymous"
        />
      </div>
      <div className={styles.attribution}>
        <p className={styles.title}>{artwork.title}</p>
        <p className={styles.artist}>{artwork.artist}</p>
        <p className={styles.date}>{artwork.date}</p>
        <a
          href={artwork.objectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.museum}
        >
          The Metropolitan Museum of Art
        </a>
        <p className={styles.accession}>Accession no. {artwork.accessionNumber}</p>
      </div>
    </div>
  )
}
