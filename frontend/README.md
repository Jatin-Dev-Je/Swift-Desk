# Ticketing System Frontend

A modern Next.js frontend for the Ticketing System with role-based access control and comprehensive ticket management.

## Features

### ✅ Implemented Features
- **Authentication & Authorization**
  - JWT-based login/logout
  - Role-based access control (USER, AGENT, ADMIN)
  - Protected routes and components

- **User Dashboard**
  - Create new tickets with priority levels
  - View personal tickets with filtering
  - Search tickets by subject/description
  - Filter by status and priority
  - Pagination support

- **Ticket Management**
  - Detailed ticket view with comments
  - Edit ticket details (subject, description, priority, status)
  - Assign tickets to agents (AGENT/ADMIN only)
  - Add comments to tickets
  - Real-time status updates

- **Admin Panel**
  - User management (create, edit roles, delete)
  - View all tickets across the system
  - Advanced filtering and search

- **Agent Features**
  - View assigned tickets
  - Update ticket status and details
  - Manage ticket assignments

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + React Query
- **HTTP Client**: Axios
- **Authentication**: JWT tokens

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running on http://localhost:8080

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Login with demo accounts:
     - **Admin**: admin / admin123
     - **Agent**: agent / agent123  
     - **User**: user / user123

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel
│   ├── dashboard/         # User dashboard
│   ├── tickets/           # Ticket management
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── admin/            # Admin-specific components
│   ├── auth/             # Authentication components
│   ├── layout/           # Layout components
│   └── tickets/          # Ticket-related components
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
└── services/             # API services
    ├── authService.ts    # Authentication API
    ├── ticketService.ts  # Ticket management API
    └── adminService.ts   # Admin operations API
```

## Key Components

### Authentication
- `AuthContext`: Manages user state and authentication
- `LoginForm`: Login interface with demo account info
- Protected routes redirect unauthenticated users

### Ticket Management
- `TicketList`: Displays tickets with filtering and pagination
- `TicketCard`: Individual ticket preview
- `TicketDetails`: Full ticket view with editing capabilities
- `CreateTicketModal`: New ticket creation form
- `CommentSection`: Ticket comments and discussion

### Admin Features
- `UserManagement`: Create, edit, and delete users
- `AllTicketsView`: System-wide ticket overview
- Role-based component visibility

## API Integration

The frontend integrates with the Spring Boot backend API:

- **Authentication**: `/api/auth/login`, `/api/auth/me`
- **Tickets**: `/api/tickets/*` with full CRUD operations
- **Admin**: `/api/admin/*` for user management
- **Search & Filter**: Query parameters for advanced filtering

## Role-Based Access

- **USER**: Can create and manage own tickets, add comments
- **AGENT**: Can view assigned tickets, update status, reassign tickets
- **ADMIN**: Full system access, user management, all tickets

## Development

### Adding New Features

1. Create API service methods in `/services/`
2. Add React components in `/components/`
3. Create pages in `/app/` directory
4. Update navigation in `Navbar.tsx`
5. Add proper TypeScript interfaces

### Environment Variables

Create `.env.local` for custom configuration:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Deployment

The application is ready for deployment on platforms like:
- Vercel (recommended for Next.js)
- Netlify
- Docker containers

Ensure the backend API URL is properly configured for production.
