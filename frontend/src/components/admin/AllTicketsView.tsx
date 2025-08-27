'use client'

import { useState, useEffect } from 'react'
import { ticketService, Ticket } from '@/services/ticketService'
import TicketList from '@/components/tickets/TicketList'

export default function AllTicketsView() {
  const [tickets, setTickets] = useState<any>({ content: [], totalElements: 0 })
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    assigneeId: undefined,
    page: 0,
    size: 10
  })

  useEffect(() => {
    loadTickets()
  }, [filters])

  const loadTickets = async () => {
    try {
      setLoading(true)
      const data = await ticketService.getAllTickets(filters)
      setTickets(data)
    } catch (error) {
      console.error('Failed to load tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters, page: 0 })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">All Tickets</h2>
        <div className="text-sm text-gray-500">
          Total: {tickets.totalElements} tickets
        </div>
      </div>

      <TicketList
        tickets={tickets}
        loading={loading}
        filters={filters}
        onFilterChange={handleFilterChange}
        onRefresh={loadTickets}
      />
    </div>
  )
}
