'use client'

import { useState } from 'react'
import { Ticket, ticketService, UpdateTicketRequest } from '@/services/ticketService'
import { adminService } from '@/services/adminService'
import CommentSection from './CommentSection'
import { useAuth } from '@/contexts/AuthContext'

interface TicketDetailsProps {
  ticket: Ticket
  onUpdate: () => void
  currentUser: any
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

export default function TicketDetails({ ticket, onUpdate, currentUser }: TicketDetailsProps) {
  const { hasRole } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    subject: ticket.subject,
    description: ticket.description,
    priority: ticket.priority,
    status: ticket.status,
    assigneeId: ticket.assignee?.id || ''
  })
  const [agents, setAgents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const canEdit = hasRole('ADMIN') || 
                 hasRole('AGENT') || 
                 ticket.owner.id === currentUser.id ||
                 ticket.assignee?.id === currentUser.id

  const canAssign = hasRole('ADMIN') || hasRole('AGENT')

  const loadAgents = async () => {
    if (canAssign) {
      try {
        const users = await adminService.getAllUsers()
        setAgents(users.filter(user => 
          user.roles.includes('AGENT') || user.roles.includes('ADMIN')
        ))
      } catch (error) {
        console.error('Failed to load agents:', error)
      }
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    loadAgents()
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      const updates: UpdateTicketRequest = {
        subject: editData.subject,
        description: editData.description,
        priority: editData.priority,
        status: editData.status
      }
      
      if (editData.assigneeId) {
        updates.assigneeId = parseInt(editData.assigneeId.toString())
      }

      await ticketService.updateTicket(ticket.id, updates)
      setIsEditing(false)
      onUpdate()
    } catch (error) {
      console.error('Failed to update ticket:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditData({
      subject: ticket.subject,
      description: ticket.description,
      priority: ticket.priority,
      status: ticket.status,
      assigneeId: ticket.assignee?.id || ''
    })
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Ticket Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editData.subject}
                  onChange={(e) => setEditData({ ...editData, subject: e.target.value })}
                  className="text-2xl font-bold text-gray-900 w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-900">
                  #{ticket.id} - {ticket.subject}
                </h1>
              )}
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              {isEditing ? (
                <select
                  value={editData.priority}
                  onChange={(e) => setEditData({ ...editData, priority: e.target.value as any })}
                  className="px-2 py-1 rounded-full text-xs font-medium border border-gray-300"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              ) : (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[ticket.priority]}`}>
                  {ticket.priority}
                </span>
              )}
              
              {isEditing ? (
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value as any })}
                  className="px-2 py-1 rounded-full text-xs font-medium border border-gray-300"
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              ) : (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[ticket.status]}`}>
                  {ticket.status.replace('_', ' ')}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
              {isEditing ? (
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900 whitespace-pre-wrap">{ticket.description}</p>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Owner</h3>
                <p className="text-gray-900">{ticket.owner.username} ({ticket.owner.email})</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Assignee</h3>
                {isEditing && canAssign ? (
                  <select
                    value={editData.assigneeId}
                    onChange={(e) => setEditData({ ...editData, assigneeId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Unassigned</option>
                    {agents.map(agent => (
                      <option key={agent.id} value={agent.id}>
                        {agent.username} ({agent.email})
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900">
                    {ticket.assignee ? `${ticket.assignee.username} (${ticket.assignee.email})` : 'Unassigned'}
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Created</h3>
                <p className="text-gray-900">{new Date(ticket.createdAt).toLocaleString()}</p>
              </div>

              {ticket.updatedAt && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                  <p className="text-gray-900">{new Date(ticket.updatedAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>

          {canEdit && (
            <div className="mt-6 flex justify-end space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Edit Ticket
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <CommentSection ticket={ticket} onUpdate={onUpdate} />
    </div>
  )
}
