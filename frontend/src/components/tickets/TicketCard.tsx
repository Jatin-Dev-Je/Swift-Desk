'use client'

import { Ticket } from '@/services/ticketService'
import Link from 'next/link'

interface TicketCardProps {
  ticket: Ticket
}

const priorityColors = {
  LOW: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
  URGENT: 'bg-red-100 text-red-800'
}

const statusColors = {
  OPEN: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  RESOLVED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-800'
}

export default function TicketCard({ ticket }: TicketCardProps) {
  return (
    <Link href={`/tickets/${ticket.id}`}>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              #{ticket.id} - {ticket.subject}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {ticket.description}
            </p>
          </div>
          
          <div className="flex flex-col items-end space-y-2 ml-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[ticket.priority]}`}>
              {ticket.priority}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[ticket.status]}`}>
              {ticket.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span>Owner: {ticket.owner.username}</span>
            {ticket.assignee && (
              <span>Assignee: {ticket.assignee.username}</span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <span>{ticket.comments.length} comments</span>
            <span>
              Created: {new Date(ticket.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
