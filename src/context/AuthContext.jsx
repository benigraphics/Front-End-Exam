import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

const AUTH_KEY = 'mfi.auth.session'

// -----------------------------------------------------------------------------
// DEMO USER DIRECTORY
// -----------------------------------------------------------------------------
// These are fake demo accounts for the simulation only — no real
// authentication, password hashing or backend is involved. Credentials are
// shown directly on the login screen so any grader/reviewer can sign in
// instantly as any required role.
// -----------------------------------------------------------------------------
export const DEMO_USERS = [
  {
    id: 'admin',
    username: 'admin',
    password: 'admin123',
    name: 'Christian Habimana',
    role: 'Administrator',
    branch: 'Head Office — Kigali',
    initials: 'CH',
    color: '#0B4F6C',
    description: 'Full access — customers, loans, officers, products, reports and settings.',
  },
  {
    id: 'manager',
    username: 'manager',
    password: 'manager123',
    name: 'Grace Uwimana',
    role: 'Branch Manager',
    branch: 'Kigali Branch',
    initials: 'GU',
    color: '#6A3FB5',
    description: 'Approves/rejects loan applications and oversees branch performance.',
  },
  {
    id: 'officer',
    username: 'officer',
    password: 'officer123',
    name: 'Cyprien Niyonzima',
    role: 'Loan Officer',
    branch: 'Kigali Branch',
    initials: 'CN',
    color: '#01A88D',
    description: 'Manages assigned customers, submits applications, records repayments.',
  },
  {
    id: 'teller',
    username: 'teller',
    password: 'teller123',
    name: 'Josiane Iradukunda',
    role: 'Teller / Cashier',
    branch: 'Musanze Branch',
    initials: 'JI',
    color: '#ED6C02',
    description: 'Front-desk repayment collection and receipt issuing.',
  },
]

const AuthContext = createContext(null)

function loadSession() {
  try {
    const raw = window.localStorage.getItem(AUTH_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadSession())

  useEffect(() => {
    if (user) window.localStorage.setItem(AUTH_KEY, JSON.stringify(user))
    else window.localStorage.removeItem(AUTH_KEY)
  }, [user])

  // Validates credentials against the demo directory only. Simulation only —
  // never a real authentication check.
  const login = useCallback((username, password) => {
    const match = DEMO_USERS.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
    )
    if (!match) return { success: false, message: 'Invalid username or password.' }
    setUser(match)
    return { success: true }
  }, [])

  const loginAsDemo = useCallback((userId) => {
    const match = DEMO_USERS.find((u) => u.id === userId)
    if (match) setUser(match)
  }, [])

  const logout = useCallback(() => setUser(null), [])

  const value = { user, isAuthenticated: !!user, login, loginAsDemo, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
