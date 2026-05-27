import { forwardRef } from 'react'
import ArtworkPanel from '../ArtworkPanel/ArtworkPanel.jsx'
import PoemPanel from '../PoemPanel/PoemPanel.jsx'
import styles from './ResultCard.module.css'

const ResultCard = forwardRef(function ResultCard({ poem, artwork, artworkError, style, mood }, ref) {
  return (
    <div className={styles.card} ref={ref}>
      <div className={styles.artworkCol}>
        <ArtworkPanel artwork={artwork} error={artworkError} />
      </div>
      <div className={styles.poemCol}>
        <PoemPanel poem={poem} style={style} mood={mood} />
      </div>
    </div>
  )
})

export default ResultCard
