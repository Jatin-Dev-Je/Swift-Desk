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

export interface User {
  id: number
  username: string
  email: string
  roles: string[]
}

export interface CreateUserRequest {
  username: string
  email: string
  password: string
  roles: string[]
}

export interface UpdateUserRolesRequest {
  roles: string[]
}

export const adminService = {
  async getAllUsers(): Promise<User[]> {
    const response = await api.get('/api/admin/users')
    return response.data
  },

  async getUserById(id: number): Promise<User> {
    const response = await api.get(`/api/admin/users/${id}`)
    return response.data
  },

  async createUser(user: CreateUserRequest): Promise<User> {
    const response = await api.post('/api/admin/users', user)
    return response.data
  },

  async updateUserRoles(id: number, roles: UpdateUserRolesRequest): Promise<User> {
    const response = await api.put(`/api/admin/users/${id}/roles`, roles)
    return response.data
  },

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/api/admin/users/${id}`)
  }
}
