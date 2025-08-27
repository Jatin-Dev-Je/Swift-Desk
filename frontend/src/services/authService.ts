import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface LoginResponse {
  token: string
  username: string
  email: string
  role: string
  roles?: string[]
  id: number
}

export interface User {
  id: number
  username: string
  email: string
  roles: string[]
}

export const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await api.post('/api/auth/login', { username, password })
    return response.data
  },

  async signup(username: string, email: string, password: string): Promise<LoginResponse> {
    const response = await api.post('/api/auth/signup', { username, email, password })
    return response.data
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/api/auth/me')
    return response.data
  },

  logout() {
    localStorage.removeItem('token')
  }
}
