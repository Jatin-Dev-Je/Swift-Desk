'use client'

import { useState } from 'react'
import { Ticket } from '@/services/ticketService'
import TicketCard from './TicketCard'
import TicketFilters from './TicketFilters'

interface TicketListProps {
  tickets: {
    content: Ticket[]
    totalElements: number
    totalPages: number
    number: number
    size: number
  }
  loading: boolean
  filters: any
  onFilterChange: (filters: any) => void
  onRefresh: () => void
}

export default function TicketList({
  tickets,
  loading,
  filters,
  onFilterChange,
  onRefresh
}: TicketListProps) {
  const handlePageChange = (page: number) => {
    onFilterChange({ page })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <TicketFilters
        filters={filters}
        onFilterChange={onFilterChange}
        onRefresh={onRefresh}
      />

      {tickets.content.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No tickets found</p>
          <p className="text-gray-400 text-sm mt-2">
            Try adjusting your filters or create a new ticket
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {tickets.content.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>

          {tickets.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <button
                onClick={() => handlePageChange(tickets.number - 1)}
                disabled={tickets.number === 0}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="px-3 py-2 text-sm text-gray-700">
                Page {tickets.number + 1} of {tickets.totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(tickets.number + 1)}
                disabled={tickets.number >= tickets.totalPages - 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}

          <div className="text-center text-sm text-gray-500">
            Showing {tickets.content.length} of {tickets.totalElements} tickets
          </div>
        </>
      )}
    </div>
  )
}
