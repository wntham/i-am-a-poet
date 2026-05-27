import { Router } from 'express'
import fetch from 'node-fetch'

const router = Router()

const MET_BASE = 'https://collectionapi.metmuseum.org/public/collection/v1'

const MOOD_TERMS = {
  Whimsical: { primary: 'fantasy fable', fallback: 'garden fairy' },
  Jubilant:  { primary: 'celebration feast', fallback: 'dance festival' },
  Wistful:   { primary: 'longing twilight', fallback: 'window solitude' },
  Unmoored:  { primary: 'storm sea', fallback: 'fog wanderer' },
  Reverie:   { primary: 'dream contemplation', fallback: 'mist reflection' },
}

// Curated fallback: known public domain Met objects with good images
const CURATED_IDS = [436524, 459206, 437984, 11804, 436121, 437853, 435882, 436535, 437908, 437980]

async function searchMet(query) {
  const url = `${MET_BASE}/search?q=${encodeURIComponent(query)}&hasImages=true&isPublicDomain=true`
  const res = await fetch(url)
  if (!res.ok) return []
  const data = await res.json()
  return data.objectIDs || []
}

async function fetchObject(id) {
  const res = await fetch(`${MET_BASE}/objects/${id}`)
  if (!res.ok) return null
  const data = await res.json()
  if (!data.primaryImageSmall || !data.isPublicDomain) return null
  return {
    objectID: data.objectID,
    title: data.title || 'Untitled',
    artist: data.artistDisplayName || 'Unknown artist',
    date: data.objectDate || '',
    imageUrl: data.primaryImageSmall,
    objectUrl: data.objectURL,
    accessionNumber: data.accessionNumber || '',
    museum: 'The Metropolitan Museum of Art',
  }
}

function pickRandom(arr, count = 20) {
  const pool = arr.slice(0, count)
  return pool[Math.floor(Math.random() * pool.length)]
}

// GET /api/artwork?mood=Wistful
router.get('/', async (req, res) => {
  const { mood } = req.query
  const terms = MOOD_TERMS[mood]

  if (!terms) {
    return res.status(400).json({ error: 'Invalid mood' })
  }

  let artwork = null

  // Try primary search term
  const primaryIDs = await searchMet(terms.primary)
  if (primaryIDs.length) {
    artwork = await fetchObject(pickRandom(primaryIDs))
  }

  // Try fallback search term
  if (!artwork) {
    const fallbackIDs = await searchMet(terms.fallback)
    if (fallbackIDs.length) {
      artwork = await fetchObject(pickRandom(fallbackIDs))
    }
  }

  // Use curated list as last resort
  if (!artwork) {
    const curatedID = CURATED_IDS[Math.floor(Math.random() * CURATED_IDS.length)]
    artwork = await fetchObject(curatedID)
  }

  if (!artwork) {
    return res.status(502).json({ error: 'Could not retrieve artwork' })
  }

  res.json(artwork)
})

// GET /api/artwork/:id — used by share link reconstruction
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10)
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid object ID' })
  }

  const artwork = await fetchObject(id)
  if (!artwork) {
    return res.status(404).json({ error: 'Artwork not found' })
  }

  res.json(artwork)
})

export default router
