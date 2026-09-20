import seed from './seed.json'

const KEY = 'trade-journal:trades'
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

function read() {
  const stored = localStorage.getItem(KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      localStorage.removeItem(KEY)
    }
  }
  localStorage.setItem(KEY, JSON.stringify(seed))
  return seed
}

function write(rows) {
  localStorage.setItem(KEY, JSON.stringify(rows))
}

function toRow(input, previous = {}) {
  return {
    ...previous,
    ticker: input.ticker.trim().toUpperCase(),
    entry_price: Number(input.entryPrice),
    exit_price: Number(input.exitPrice),
    position_size: Number(input.positionSize),
    trade_date: input.tradeDate,
    outcome: input.outcome,
    notes: input.notes?.trim() ?? '',
  }
}

export async function listTrades() {
  await delay()
  return read().slice().sort((a, b) =>
    `${b.trade_date}${b.created_at}`.localeCompare(`${a.trade_date}${a.created_at}`)
  )
}

export async function createTrade(input) {
  await delay()
  const created = toRow(input, { id: crypto.randomUUID(), created_at: new Date().toISOString() })
  write([...read(), created])
  return created
}

export async function updateTrade(id, input) {
  await delay()
  const rows = read()
  const index = rows.findIndex((row) => String(row.id) === String(id))
  if (index === -1) throw new Error('Trade not found')
  rows[index] = toRow(input, rows[index])
  write(rows)
  return rows[index]
}

export async function deleteTrade(id) {
  await delay()
  write(read().filter((row) => String(row.id) !== String(id)))
}
