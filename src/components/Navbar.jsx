import { Link, useLocation, useNavigate } from 'react-router-dom'
import { MessageCircle, BarChart2, BookHeart, Home, LogOut, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/chat', label: 'Chat', icon: MessageCircle },
  { to: '/mood', label: 'Mood', icon: BarChart2 },
  { to: '/resources', label: 'Resources', icon: BookHeart },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(8,12,20,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 2rem',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--accent2), var(--accent))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
          }}>🧠</div>
          <span style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700, fontSize: 18,
            color: 'var(--text)',
            letterSpacing: '-0.02em',
          }}>MindSpace</span>
        </Link>

        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {links.map(({ to, label, icon: Icon }) => {
            const active = pathname === to
            return (
              <Link key={to} to={to} style={{
                textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 10,
                fontSize: 14, fontWeight: 500,
                color: active ? 'var(--text)' : 'var(--text2)',
                background: active ? 'var(--card2)' : 'transparent',
                border: active ? '1px solid var(--border2)' : '1px solid transparent',
                transition: 'all 0.2s',
              }}>
                <Icon size={15} />
                {label}
              </Link>
            )
          })}

          <div style={{ marginLeft: 8, paddingLeft: 8, borderLeft: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            {user ? (
              <>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'var(--card2)', border: '1px solid var(--border2)',
                  borderRadius: 10, padding: '6px 12px',
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent2), var(--accent))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: '#fff',
                  }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
                    {user.name.split(' ')[0]}
                  </span>
                </div>
                <button onClick={handleLogout} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'transparent', border: '1px solid var(--border)',
                  borderRadius: 10, padding: '7px 12px',
                  fontSize: 13, color: 'var(--text2)',
                  transition: 'all 0.2s', cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#F75C5C'; e.currentTarget.style.borderColor = '#F75C5C' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.borderColor = 'var(--border)' }}
                >
                  <LogOut size={14} /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'linear-gradient(135deg, var(--accent2), var(--accent))',
                border: 'none', borderRadius: 10,
                padding: '7px 14px', fontSize: 13,
                fontWeight: 500, color: '#fff',
                textDecoration: 'none',
              }}>
                <LogIn size={14} /> Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
