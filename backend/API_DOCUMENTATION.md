# Ticketing System API Documentation

## Base URL
```
http://localhost:8080
```

## Demo Users
The system initializes with these demo users:
- **Admin**: `admin` / `admin123`
- **Agent**: `agent` / `agent123` 
- **User**: `user` / `user123`

## Authentication

### 1. Login
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "admin",
  "email": "admin@ticketing.com",
  "role": "ADMIN"
}
```

### 2. Get Current User
**GET** `/api/auth/me`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "username": "admin",
  "email": "admin@ticketing.com",
  "role": "ADMIN"
}
```

### 3. Logout
**POST** `/api/auth/logout`

**Headers:**
```
Authorization: Bearer {token}
```

## Ticket Management

### 1. Get All Tickets (with filters)
**GET** `/api/tickets?search=bug&status=OPEN&priority=HIGH&assigneeId=1&page=0&size=10`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `search` (optional): Search in subject/description
- `status` (optional): OPEN, IN_PROGRESS, RESOLVED, CLOSED
- `priority` (optional): LOW, MEDIUM, HIGH, URGENT
- `assigneeId` (optional): Filter by assigned user ID
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 20)

### 2. Get My Tickets
**GET** `/api/tickets/my-tickets?status=OPEN&priority=HIGH`

**Headers:**
```
Authorization: Bearer {token}
```

### 3. Get Assigned Tickets (for agents/admins)
**GET** `/api/tickets/assigned?status=IN_PROGRESS`

**Headers:**
```
Authorization: Bearer {token}
```

### 4. Get Ticket by ID
**GET** `/api/tickets/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": 1,
  "subject": "Login Issue",
  "description": "Cannot login to the system",
  "priority": "HIGH",
  "status": "OPEN",
  "owner": {
    "id": 1,
    "username": "user",
    "email": "user@ticketing.com",
    "roles": ["USER"]
  },
  "assignee": null,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "comments": []
}
```

### 5. Create Ticket
**POST** `/api/tickets`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "subject": "Login Issue",
  "description": "Cannot login to the system",
  "priority": "HIGH"
}
```

### 6. Update Ticket
**PUT** `/api/tickets/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "subject": "Updated Login Issue",
  "description": "Updated description",
  "priority": "MEDIUM",
  "status": "IN_PROGRESS",
  "assigneeId": 2
}
```

### 7. Delete Ticket
**DELETE** `/api/tickets/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

### 8. Add Comment to Ticket
**POST** `/api/tickets/{id}/comments`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "body": "This is a comment on the ticket"
}
```

### 9. Get Ticket Comments
**GET** `/api/tickets/{id}/comments`

**Headers:**
```
Authorization: Bearer {token}
```

## Admin Management (Admin Only)

### 1. Admin Health Check
**GET** `/api/admin/health`

**Headers:**
```
Authorization: Bearer {admin_token}
```

### 2. Get All Users
**GET** `/api/admin/users`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response:**
```json
[
  {
    "id": 1,
    "username": "admin",
    "email": "admin@ticketing.com",
    "roles": ["ADMIN"]
  }
]
```

### 3. Get User by ID
**GET** `/api/admin/users/{id}`

**Headers:**
```
Authorization: Bearer {admin_token}
```

### 4. Create User
**POST** `/api/admin/users`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "username": "newuser",
  "email": "newuser@ticketing.com",
  "password": "password123",
  "roles": ["USER"]
}
```

### 5. Update User Roles
**PUT** `/api/admin/users/{id}/roles`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "roles": ["USER", "AGENT"]
}
```

### 6. Delete User
**DELETE** `/api/admin/users/{id}`

**Headers:**
```
Authorization: Bearer {admin_token}
```

## Testing with cURL Examples

### 1. Login as Admin
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 2. Create a Ticket
```bash
curl -X POST http://localhost:8080/api/tickets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"subject":"Test Ticket","description":"This is a test ticket","priority":"HIGH"}'
```

### 3. Get All Tickets
```bash
curl -X GET "http://localhost:8080/api/tickets?page=0&size=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Add Comment to Ticket
```bash
curl -X POST http://localhost:8080/api/tickets/1/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"body":"This is a test comment"}'
```

## Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **204 No Content**: Resource deleted successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

## Error Response Format

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/tickets"
}
```

## Role-Based Access Control

- **USER**: Can create, view, and comment on their own tickets
- **AGENT**: Can view assigned tickets, update ticket status, add comments
- **ADMIN**: Full access to all endpoints, user management, ticket override

## Database Schema

### Users Table
- `id` (Long, Primary Key)
- `username` (String, Unique)
- `email` (String, Unique)
- `password` (String, Encrypted)

### Roles Table
- `id` (Long, Primary Key)
- `name` (String): ADMIN, AGENT, USER

### Tickets Table
- `id` (Long, Primary Key)
- `subject` (String)
- `description` (Text)
- `priority` (Enum): LOW, MEDIUM, HIGH, URGENT
- `status` (Enum): OPEN, IN_PROGRESS, RESOLVED, CLOSED
- `owner_id` (Foreign Key to Users)
- `assignee_id` (Foreign Key to Users, Optional)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Comments Table
- `id` (Long, Primary Key)
- `ticket_id` (Foreign Key to Tickets)
- `author_id` (Foreign Key to Users)
- `body` (Text)
- `created_at` (Timestamp)
