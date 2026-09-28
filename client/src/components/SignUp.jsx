import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { register } from '../api'

export default function SignUp({ onAuthenticated }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function submit(event) {
    event.preventDefault(); setSaving(true); setError('')
    try { const { user } = await register({ email, password }); onAuthenticated(user); navigate('/', { replace: true }) }
    catch (caught) { setError(caught.message) }
    finally { setSaving(false) }
  }

  return <main className="auth-page"><form className="panel auth-form" onSubmit={submit}><p className="eyebrow">TRADEJOURNAL</p><h1>Create account</h1>{error && <p className="error" role="alert">{error}</p>}<label>Email<input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label><label>Password<input type="password" autoComplete="new-password" minLength="12" maxLength="128" value={password} onChange={(e) => setPassword(e.target.value)} required /><small>Use 12–128 characters.</small></label><button className="primary-button" disabled={saving}>{saving ? 'Creating account…' : 'Create account'}</button><p>Already registered? <Link to="/login">Sign in</Link></p></form></main>
}
