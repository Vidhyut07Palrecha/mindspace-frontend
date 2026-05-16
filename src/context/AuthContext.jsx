import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

const API = 'http://localhost:5000/api'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('mindspace_token'))
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => {
    localStorage.removeItem('mindspace_token')
    setToken(null)
    setUser(null)
  }, [])

  useEffect(() => {
    if (token) {
      fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => r.json())
        .then(data => {
          if (data.user) setUser(data.user)
          else logout()
        })
        .catch(() => logout())
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [logout])

 async function register(name, email, password) {
  try {
    console.log("Sending register request:", {
      name,
      email,
      password
    })

    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    })

    console.log("Response status:", res.status)

    const data = await res.json()

    console.log("Response data:", data)

    if (!res.ok) {
      throw new Error(data.message || 'Registration failed')
    }

    localStorage.setItem('mindspace_token', data.token)

    setToken(data.token)
    setUser(data.user)

  } catch (err) {
    console.error("REGISTER ERROR:", err)
    throw err
  }
}

  async function login(email, password) {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    localStorage.setItem('mindspace_token', data.token)
    setToken(data.token)
    setUser(data.user)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
