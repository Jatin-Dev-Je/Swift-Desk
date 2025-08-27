'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import TicketList from '@/components/tickets/TicketList'
import CreateTicketModal from '@/components/tickets/CreateTicketModal'
import { ticketService, Ticket } from '@/services/ticketService'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [tickets, setTickets] = useState<any>({ content: [], totalElements: 0 })
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [ticketsLoading, setTicketsLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    page: 0,
    size: 10
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadTickets()
    }
  }, [user, filters])

  const loadTickets = async () => {
    try {
      setTicketsLoading(true)
      const data = await ticketService.getMyTickets(filters)
      setTickets(data)
    } catch (error) {
      console.error('Failed to load tickets:', error)
    } finally {
      setTicketsLoading(false)
    }
  }

  const handleCreateTicket = async (ticketData: any) => {
    try {
      await ticketService.createTicket(ticketData)
      setIsCreateModalOpen(false)
      loadTickets()
    } catch (error) {
      console.error('Failed to create ticket:', error)
    }
  }

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters, page: 0 })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Create New Ticket
            </button>
          </div>

          <TicketList
            tickets={tickets}
            loading={ticketsLoading}
            filters={filters}
            onFilterChange={handleFilterChange}
            onRefresh={loadTickets}
          />
        </div>
      </div>

      {isCreateModalOpen && (
        <CreateTicketModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateTicket}
        />
      )}
    </div>
  )
}
