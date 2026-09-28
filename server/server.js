import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { pool } from './db/pool.js'
import * as trades from './sightingsRepo.js'
import * as users from './usersRepo.js'

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

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('JWT_SECRET must be set to a random value at least 32 characters long.')
  process.exit(1)
}

const isProduction = process.env.NODE_ENV === 'production'
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: process.env.COOKIE_SAME_SITE || 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
}

app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(express.json({ limit: '100kb' }))
app.use(cookieParser())

function publicUser(user) {
  return { id: user.id, email: user.email, createdAt: user.created_at }
}

function signIn(response, user) {
  const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
  response.cookie('tradejournal_token', token, cookieOptions)
}

function requireAuth(request, response, next) {
  const token = request.cookies.tradejournal_token
  if (!token) return response.status(401).json({ error: 'Authentication required' })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    request.user = { id: Number(payload.sub), email: payload.email }
    if (!Number.isInteger(request.user.id)) throw new Error('Invalid token subject')
    next()
  } catch {
    response.clearCookie('tradejournal_token', { ...cookieOptions, maxAge: undefined })
    return response.status(401).json({ error: 'Session expired or invalid' })
  }
}

function validateCredentials(body) {
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body.password === 'string' ? body.password : ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return { error: 'Enter a valid email address' }
  if (password.length < 12 || password.length > 128) return { error: 'Password must be 12–128 characters' }
  return { email, password }
}

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

app.post('/api/auth/register', async (request, response, next) => {
  const credentials = validateCredentials(request.body ?? {})
  if (credentials.error) return response.status(400).json({ error: credentials.error })

  try {
    if (await users.findByEmail(pool, credentials.email)) {
      return response.status(409).json({ error: 'An account with that email already exists' })
    }
    const passwordHash = await bcrypt.hash(credentials.password, 12)
    const user = await users.create(pool, { email: credentials.email, passwordHash })
    signIn(response, user)
    response.status(201).json({ user: publicUser(user) })
  } catch (error) {
    if (error.code === '23505') return response.status(409).json({ error: 'An account with that email already exists' })
    next(error)
  }
})

app.post('/api/auth/login', async (request, response, next) => {
  const credentials = validateCredentials(request.body ?? {})
  if (credentials.error) return response.status(400).json({ error: credentials.error })

  try {
    const user = await users.findByEmail(pool, credentials.email)
    if (!user || !(await bcrypt.compare(credentials.password, user.password_hash))) {
      return response.status(401).json({ error: 'Invalid email or password' })
    }
    signIn(response, user)
    response.json({ user: publicUser(user) })
  } catch (error) {
    next(error)
  }
})

app.get('/api/auth/me', requireAuth, (request, response) => {
  response.json({ user: request.user })
})

app.post('/api/auth/logout', (request, response) => {
  response.clearCookie('tradejournal_token', { ...cookieOptions, maxAge: undefined })
  response.status(204).end()
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

app.get('/api/trades', requireAuth, async (request, response, next) => {
  try {
    response.json(await trades.getAll(pool, request.user.id))
  } catch (error) {
    next(error)
  }
})

app.get('/api/trades/:id', requireAuth, async (request, response, next) => {
  try {
    const row = await trades.getById(pool, request.params.id, request.user.id)
    if (!row) return response.status(404).json({ error: 'Not found' })
    response.json(row)
  } catch (error) {
    next(error)
  }
})

app.post('/api/trades', requireAuth, async (request, response, next) => {
  const { errors, value } = validate(request.body ?? {})
  if (errors.length > 0) return response.status(400).json({ error: errors.join('; ') })

  try {
    response.status(201).json(await trades.create(pool, request.user.id, value))
  } catch (error) {
    next(error)
  }
})

app.put('/api/trades/:id', requireAuth, async (request, response, next) => {
  const { errors, value } = validate(request.body ?? {})
  if (errors.length > 0) return response.status(400).json({ error: errors.join('; ') })

  try {
    const row = await trades.update(pool, request.params.id, request.user.id, value)
    if (!row) return response.status(404).json({ error: 'Not found' })
    response.json(row)
  } catch (error) {
    next(error)
  }
})

app.delete('/api/trades/:id', requireAuth, async (request, response, next) => {
  try {
    const removed = await trades.remove(pool, request.params.id, request.user.id)
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
