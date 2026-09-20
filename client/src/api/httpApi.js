// The real client. Every function here talks to YOUR Express API.
//
// This is the file that matters for your finals project. mockApi.js exists so
// you can build the interface before this has anywhere to point.

const BASE = import.meta.env.VITE_API_BASE_URL || ''

async function request(path, options) {
  const response = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    // Try to use the API's own message; fall back to the status line.
    let message = `${response.status} ${response.statusText}`
    try {
      const body = await response.json()
      if (body?.error) message = body.error
    } catch {
      // The body was not JSON. The status line is all we have.
    }
    throw new Error(message)
  }

  return response.status === 204 ? null : response.json()
}

export const listTrades = () => request('/api/trades')

export const createTrade = (input) =>
  request('/api/trades', { method: 'POST', body: JSON.stringify(input) })

export const updateTrade = (id, input) =>
  request(`/api/trades/${id}`, { method: 'PUT', body: JSON.stringify(input) })

export const deleteTrade = (id) =>
  request(`/api/trades/${id}`, { method: 'DELETE' })
