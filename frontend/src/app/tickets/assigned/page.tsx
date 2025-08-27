'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import TicketList from '@/components/tickets/TicketList'
import { ticketService } from '@/services/ticketService'

export default function AssignedTicketsPage() {
  const { user, loading, hasRole } = useAuth()
  const router = useRouter()
  const [tickets, setTickets] = useState<any>({ content: [], totalElements: 0 })
  const [ticketsLoading, setTicketsLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    page: 0,
    size: 10
  })

  useEffect(() => {
    if (!loading && (!user || (!hasRole('AGENT') && !hasRole('ADMIN')))) {
      router.push('/dashboard')
    }
  }, [user, loading, hasRole, router])

  useEffect(() => {
    if (user && (hasRole('AGENT') || hasRole('ADMIN'))) {
      loadTickets()
    }
  }, [user, filters, hasRole])

  const loadTickets = async () => {
    try {
      setTicketsLoading(true)
      const data = await ticketService.getAssignedTickets(filters)
      setTickets(data)
    } catch (error) {
      console.error('Failed to load assigned tickets:', error)
    } finally {
      setTicketsLoading(false)
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

  if (!user || (!hasRole('AGENT') && !hasRole('ADMIN'))) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Assigned Tickets</h1>
            <div className="text-sm text-gray-500">
              Total: {tickets.totalElements} tickets assigned to you
            </div>
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
    </div>
  )
}
