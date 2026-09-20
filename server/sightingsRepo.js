// The TradeJournal data-access layer.
//
// Every query is parameterised: values go in the array, never into the string.
// This is the single most important habit in database code, and it is what
// stops an attempted SQL command in a form field from being a real
// problem.

export async function getAll(pool) {
  const result = await pool.query('SELECT * FROM trades ORDER BY trade_date DESC, created_at DESC')
  return result.rows
}

export async function getById(pool, id) {
  const result = await pool.query('SELECT * FROM trades WHERE id = $1', [id])
  return result.rows[0] ?? null
}

export async function create(pool, { ticker, entryPrice, exitPrice, positionSize, tradeDate, outcome, notes }) {
  const result = await pool.query(
    `INSERT INTO trades (ticker, entry_price, exit_price, position_size, trade_date, outcome, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [ticker, entryPrice, exitPrice, positionSize, tradeDate, outcome, notes]
  )
  return result.rows[0]
}

export async function update(pool, id, { ticker, entryPrice, exitPrice, positionSize, tradeDate, outcome, notes }) {
  const result = await pool.query(
    `UPDATE trades
     SET ticker = $1, entry_price = $2, exit_price = $3, position_size = $4,
         trade_date = $5, outcome = $6, notes = $7
     WHERE id = $8
     RETURNING *`,
    [ticker, entryPrice, exitPrice, positionSize, tradeDate, outcome, notes, id]
  )
  return result.rows[0] ?? null
}

export async function remove(pool, id) {
  const result = await pool.query(
    'DELETE FROM trades WHERE id = $1 RETURNING id',
    [id]
  )
  return result.rowCount > 0
}
