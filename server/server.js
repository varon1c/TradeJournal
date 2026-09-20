import express from 'express'
import cors from 'cors'
import { pool } from './db/pool.js'
import * as trades from './sightingsRepo.js'

const app = express()

// CORS before the routes. Middleware registered after a route never sees that
// route's requests, which is the m4 lesson showing up in production.
//
// Name your origins. app.use(cors()) with no options sends
// Access-Control-Allow-Origin: *, which lets any site on the internet call this
// API from a visitor's browser, and is incompatible with cookies.
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(cors({ origin: allowedOrigins }))
app.use(express.json({ limit: '100kb' }))

// Is the process alive?
app.get('/healthz', (request, response) => {
  response.json({ ok: true })
})

// Is the database reachable? A different question, and the one that tells you
// in two seconds which half of a problem you have.
app.get('/readyz', async (request, response) => {
  try {
    await pool.query('SELECT 1')
    response.json({ ok: true, db: 'up' })
  } catch (error) {
    console.error('readyz failed:', error.message)
    response.status(503).json({ ok: false, db: 'down' })
  }
})

// Validation lives on the server because the client can be bypassed. The
// browser form is for a fast, friendly message; this is for correctness.
function validate(body) {
  const errors = []
  const ticker = typeof body.ticker === 'string' ? body.ticker.trim().toUpperCase() : ''
  const notes = typeof body.notes === 'string' ? body.notes.trim() : ''
  const entryPrice = Number(body.entryPrice)
  const exitPrice = Number(body.exitPrice)
  const positionSize = Number(body.positionSize)
  const tradeDate = typeof body.tradeDate === 'string' ? body.tradeDate : ''
  const outcome = typeof body.outcome === 'string' ? body.outcome : ''

  if (!ticker) errors.push('ticker is required')
  if (ticker.length > 20) errors.push('ticker must be 20 characters or fewer')
  if (!Number.isFinite(entryPrice) || entryPrice < 0) errors.push('entry price must be zero or more')
  if (!Number.isFinite(exitPrice) || exitPrice < 0) errors.push('exit price must be zero or more')
  if (!Number.isFinite(positionSize) || positionSize <= 0) errors.push('position size must be greater than zero')
  const parsedDate = new Date(`${tradeDate}T00:00:00Z`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tradeDate) || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== tradeDate) {
    errors.push('a valid trade date is required')
  }
  if (!['win', 'loss'].includes(outcome)) errors.push('outcome must be win or loss')
  if (notes.length > 2000) errors.push('notes must be 2,000 characters or fewer')

  return { errors, value: { ticker, entryPrice, exitPrice, positionSize, tradeDate, outcome, notes } }
}

app.get('/api/trades', async (request, response, next) => {
  try {
    response.json(await trades.getAll(pool))
  } catch (error) {
    next(error)
  }
})

app.get('/api/trades/:id', async (request, response, next) => {
  try {
    const row = await trades.getById(pool, request.params.id)
    if (!row) return response.status(404).json({ error: 'Not found' })
    response.json(row)
  } catch (error) {
    next(error)
  }
})

app.post('/api/trades', async (request, response, next) => {
  const { errors, value } = validate(request.body ?? {})
  if (errors.length > 0) return response.status(400).json({ error: errors.join('; ') })

  try {
    response.status(201).json(await trades.create(pool, value))
  } catch (error) {
    next(error)
  }
})

app.put('/api/trades/:id', async (request, response, next) => {
  const { errors, value } = validate(request.body ?? {})
  if (errors.length > 0) return response.status(400).json({ error: errors.join('; ') })

  try {
    const row = await trades.update(pool, request.params.id, value)
    if (!row) return response.status(404).json({ error: 'Not found' })
    response.json(row)
  } catch (error) {
    next(error)
  }
})

app.delete('/api/trades/:id', async (request, response, next) => {
  try {
    const removed = await trades.remove(pool, request.params.id)
    if (!removed) return response.status(404).json({ error: 'Not found' })
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.use((request, response) => {
  response.status(404).json({ error: 'No such route' })
})

// The detail goes in your logs; the visitor gets a plain message. Sending a
// stack trace to a stranger tells them about your file layout and dependencies.
app.use((error, request, response, next) => {
  console.error(error)
  response.status(500).json({ error: 'Something went wrong on the server' })
})

// The host chooses the port and tells you through PORT. Hardcoding 3000 is the
// commonest reason a first deploy is marked unhealthy and killed.
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
  console.log(`CORS allows: ${allowedOrigins.join(', ')}`)
})
