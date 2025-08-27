'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import TicketDetails from '@/components/tickets/TicketDetails'
import { ticketService, Ticket } from '@/services/ticketService'

export default function TicketPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const ticketId = parseInt(params.id as string)
  
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [ticketLoading, setTicketLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && ticketId) {
      loadTicket()
    }
  }, [user, ticketId])

  const loadTicket = async () => {
    try {
      setTicketLoading(true)
      const data = await ticketService.getTicketById(ticketId)
      setTicket(data)
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load ticket')
    } finally {
      setTicketLoading(false)
    }
  }

  if (loading || ticketLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">{error}</p>
            <button
              onClick={() => router.back()}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {ticket && (
            <TicketDetails 
              ticket={ticket} 
              onUpdate={loadTicket}
              currentUser={user}
            />
          )}
        </div>
      </div>
    </div>
  )
}
