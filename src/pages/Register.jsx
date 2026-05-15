import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, User, ArrowRight, Loader } from 'lucide-react'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setError('')
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError('Please fill in all fields')
      return
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
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

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name', icon: User },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', icon: Mail },
    { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••', icon: Lock },
    { key: 'confirm', label: 'Confirm Password', type: 'password', placeholder: '••••••••', icon: Lock },
  ]

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
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'linear-gradient(135deg, var(--accent2), var(--accent))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, margin: '0 auto 16px',
          }}>🧠</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>
            Create your account
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text2)' }}>
            Start your mental wellness journey
          </p>
        </div>

        {error && (
          <div style={{
            background: '#F75C5C15', border: '1px solid #F75C5C44',
            borderRadius: 10, padding: '10px 14px',
            fontSize: 13, color: '#F75C5C', marginBottom: 20,
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {fields.map(({ key, label, type, placeholder, icon: Icon }) => (
            <div key={key}>
              <label style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 6, display: 'block', fontWeight: 500 }}>
                {label}
              </label>
              <div style={{ position: 'relative' }}>
                <Icon size={15} color="var(--text3)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
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
          ))}

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
              ? <><Loader size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> Creating account...</>
              : <>Create account <ArrowRight size={15} /></>
            }
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text2)', marginTop: 24 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
            Sign in
          </Link>
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
