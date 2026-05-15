import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, ArrowRight, Loader } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setError('')
    if (!form.email || !form.password) {
      setError('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem',
    }}>
      <div className="fade-in" style={{
        width: '100%', maxWidth: 420,
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 20, padding: '40px 36px',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'linear-gradient(135deg, var(--accent2), var(--accent))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, margin: '0 auto 16px',
          }}>🧠</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>
            Welcome back
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text2)' }}>
            Sign in to your MindSpace account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#F75C5C15', border: '1px solid #F75C5C44',
            borderRadius: 10, padding: '10px 14px',
            fontSize: 13, color: '#F75C5C', marginBottom: 20,
          }}>
            {error}
          </div>
        )}

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 6, display: 'block', fontWeight: 500 }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} color="var(--text3)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                onKeyDown={handleKey}
                style={{
                  width: '100%', background: 'var(--card2)',
                  border: '1px solid var(--border)', borderRadius: 10,
                  color: 'var(--text)', fontSize: 14,
                  padding: '11px 12px 11px 36px', outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 6, display: 'block', fontWeight: 500 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} color="var(--text3)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                onKeyDown={handleKey}
                style={{
                  width: '100%', background: 'var(--card2)',
                  border: '1px solid var(--border)', borderRadius: 10,
                  color: 'var(--text)', fontSize: 14,
                  padding: '11px 12px 11px 36px', outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading} style={{
            width: '100%', padding: '12px',
            background: 'linear-gradient(135deg, var(--accent2), var(--accent))',
            border: 'none', borderRadius: 10,
            color: '#fff', fontSize: 14, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            marginTop: 6, opacity: loading ? 0.7 : 1,
            transition: 'opacity 0.2s',
          }}>
            {loading
              ? <><Loader size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> Signing in...</>
              : <>Sign in <ArrowRight size={15} /></>
            }
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text2)', marginTop: 24 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
            Create one
          </Link>
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
