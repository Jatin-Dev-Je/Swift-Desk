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

export interface Ticket {
  id: number
  subject: string
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  owner: {
    id: number
    username: string
    email: string
    roles: string[]
  }
  assignee?: {
    id: number
    username: string
    email: string
    roles: string[]
  }
  createdAt: string
  updatedAt?: string
  comments: Comment[]
}

export interface Comment {
  id: number
  body: string
  author: {
    id: number
    username: string
    email: string
    roles: string[]
  }
  createdAt: string
}

export interface CreateTicketRequest {
  subject: string
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
}

export interface UpdateTicketRequest {
  subject?: string
  description?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  assigneeId?: number
}

export interface AddCommentRequest {
  body: string
}

export interface TicketFilters {
  search?: string
  status?: string
  priority?: string
  assigneeId?: number
  page?: number
  size?: number
}

export const ticketService = {
  async getAllTickets(filters: TicketFilters = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString())
      }
    })
    
    const response = await api.get(`/api/tickets?${params.toString()}`)
    return response.data
  },

  async getMyTickets(filters: TicketFilters = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString())
      }
    })
    
    const response = await api.get(`/api/tickets/my-tickets?${params.toString()}`)
    return response.data
  },

  async getAssignedTickets(filters: TicketFilters = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString())
      }
    })
    
    const response = await api.get(`/api/tickets/assigned?${params.toString()}`)
    return response.data
  },

  async getTicketById(id: number): Promise<Ticket> {
    const response = await api.get(`/api/tickets/${id}`)
    return response.data
  },

  async createTicket(ticket: CreateTicketRequest): Promise<Ticket> {
    const response = await api.post('/api/tickets', ticket)
    return response.data
  },

  async updateTicket(id: number, updates: UpdateTicketRequest): Promise<Ticket> {
    const response = await api.put(`/api/tickets/${id}`, updates)
    return response.data
  },

  async deleteTicket(id: number): Promise<void> {
    await api.delete(`/api/tickets/${id}`)
  },

  async addComment(ticketId: number, comment: AddCommentRequest): Promise<Ticket> {
    const response = await api.post(`/api/tickets/${ticketId}/comments`, comment)
    return response.data
  }
}
