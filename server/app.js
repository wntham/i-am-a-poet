import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import poemRouter from './routes/poem.js'
import artworkRouter from './routes/artwork.js'

const app = express()

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
}))
app.use(express.json())

app.use('/api/poem', poemRouter)
app.use('/api/artwork', artworkRouter)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

export default app
