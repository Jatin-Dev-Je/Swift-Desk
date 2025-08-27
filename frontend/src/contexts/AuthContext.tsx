'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService } from '@/services/authService'

interface User {
  id: number
  username: string
  email: string
  roles: string[]
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  signup: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  hasRole: (role: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      authService.getCurrentUser()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('token')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username: string, password: string) => {
    const response = await authService.login(username, password)
    localStorage.setItem('token', response.token)
    setUser({
      id: response.id,
      username: response.username,
      email: response.email,
      roles: response.roles || [response.role]
    })
  }

  const signup = async (username: string, email: string, password: string) => {
    const response = await authService.signup(username, email, password)
    localStorage.setItem('token', response.token)
    setUser({
      id: response.id,
      username: response.username,
      email: response.email,
      roles: response.roles || [response.role]
    })
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const hasRole = (role: string) => {
    return user?.roles?.includes(role) || false
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
