# Ticketing Backend

This is a Spring Boot backend for the Ticketing System.

Local run instructions (Windows PowerShell):

1. Open PowerShell and change directory to the backend folder:

```powershell
cd D:\\Ticket\\backend
```

2. Build and run using the Gradle wrapper:

```powershell
.\\gradlew.bat clean bootJar --no-daemon --console=plain
java -jar build\\libs\\ticketing-backend-0.0.1-SNAPSHOT.jar
```

Notes:
- The app uses an in-memory H2 database by default for local development (no Postgres required).
- JWT secret in `application.properties` is a development value; change for production.

If you prefer to use Bash, make sure `gradlew` is the official Unix wrapper script and executable (`chmod +x gradlew`).
# Ticketing System Backend

A full-stack ticketing system built with Spring Boot for IT support and customer service scenarios.

## Features

### ✅ Must-Have Features
1. **Authentication & Authorization**
   - JWT-based authentication
   - Role-based access control (User, Admin, Support Agent)
   - Users can only manage their own tickets

2. **User Dashboard**
   - Create new tickets with subject, description, and priority
   - View list of tickets and current status
   - Add comments to tickets
   - View ticket history with all comments

3. **Ticket Management**
   - Ticket lifecycle: Open → In Progress → Resolved → Closed
   - Reassign tickets to support agents
   - Comment threads with timestamps and user info
   - Track ticket owner and assignee

4. **Admin Panel**
   - User management (add/remove users, assign roles)
   - View all tickets
   - Force reassign or resolve/close any ticket
   - Monitor ticket statuses across users

5. **Access Control**
   - Only admins can manage users and override tickets
   - Support agents can be assigned to tickets, add comments, and change statuses
   - Regular users can only manage their own tickets

## Technology Stack

- **Backend**: Java 17, Spring Boot 3.3.2
- **Database**: H2 (development), PostgreSQL (production)
- **Security**: Spring Security with JWT
- **Build Tool**: Gradle

## Getting Started

### Prerequisites
- Java 17 or higher
- Gradle (or use the included wrapper)

### Running the Application

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Start the application**
   ```bash
   # Windows
   .\gradlew.bat bootRun
   
   # Linux/Mac
   ./gradlew bootRun
   ```

3. **Access the application**
   - API: http://localhost:8080
   - H2 Console: http://localhost:8080/h2-console
     - JDBC URL: `jdbc:h2:mem:ticketing`
     - Username: `sa`
     - Password: (leave empty)

### Default Users

The application comes with pre-configured users:

| Username | Password | Role | Description |
|----------|----------|------|-------------|
| admin | admin123 | ADMIN | Full system access |
| agent | agent123 | AGENT | Support agent access |
| user | user123 | USER | Regular user access |

## API Documentation

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "user",
  "password": "user123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "user",
  "email": "user@ticketing.com",
  "role": "USER"
}
```

### Tickets

#### Get All Tickets (Admin/Agent only)
```http
GET /api/tickets?page=0&size=10
Authorization: Bearer <token>
```

#### Get My Tickets
```http
GET /api/tickets/my-tickets?page=0&size=10
Authorization: Bearer <token>
```

#### Get Assigned Tickets (Agent only)
```http
GET /api/tickets/assigned?page=0&size=10
Authorization: Bearer <token>
```

#### Get Ticket by ID
```http
GET /api/tickets/{id}
Authorization: Bearer <token>
```

#### Create Ticket
```http
POST /api/tickets
Authorization: Bearer <token>
Content-Type: application/json

{
  "subject": "System not working",
  "description": "I cannot access the application",
  "priority": "HIGH"
}
```

#### Update Ticket
```http
PUT /api/tickets/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "IN_PROGRESS",
  "assigneeId": 2
}
```

#### Delete Ticket
```http
DELETE /api/tickets/{id}
Authorization: Bearer <token>
```

#### Add Comment
```http
POST /api/tickets/{id}/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "body": "I'm working on this issue"
}
```

### Admin Operations

#### Get All Users
```http
GET /api/admin/users
Authorization: Bearer <admin-token>
```

#### Create User
```http
POST /api/admin/users
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "roles": ["USER"]
}
```

#### Update User Roles
```http
PUT /api/admin/users/{id}/roles
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "roles": ["AGENT"]
}
```

#### Delete User
```http
DELETE /api/admin/users/{id}
Authorization: Bearer <admin-token>
```

## Data Models

### Ticket
```json
{
  "id": 1,
  "subject": "System not working",
  "description": "I cannot access the application",
  "priority": "HIGH",
  "status": "OPEN",
  "owner": {
    "id": 1,
    "username": "user",
    "email": "user@ticketing.com",
    "roles": ["USER"]
  },
  "assignee": {
    "id": 2,
    "username": "agent",
    "email": "agent@ticketing.com",
    "roles": ["AGENT"]
  },
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-01-01T10:30:00Z",
  "comments": [
    {
      "id": 1,
      "body": "I'm working on this issue",
      "author": {
        "id": 2,
        "username": "agent",
        "email": "agent@ticketing.com",
        "roles": ["AGENT"]
      },
      "createdAt": "2024-01-01T10:30:00Z"
    }
  ]
}
```

### Priority Levels
- `LOW`
- `MEDIUM`
- `HIGH`
- `URGENT`

### Status Values
- `OPEN`
- `IN_PROGRESS`
- `RESOLVED`
- `CLOSED`

### Roles
- `ADMIN` - Full system access
- `AGENT` - Support agent access
- `USER` - Regular user access

## Security

- JWT tokens for stateless authentication
- Role-based authorization using Spring Security
- Password encryption using BCrypt
- Input validation and sanitization

## Development

### Project Structure
```
src/main/java/com/ticketing/
├── config/          # Configuration classes
├── controller/      # REST controllers
├── dto/            # Data Transfer Objects
├── exception/      # Exception handling
├── model/          # Entity models
├── repository/     # Data access layer
└── service/        # Business logic
```

### Adding New Features

1. **Create DTOs** in the `dto` package
2. **Add service methods** in the appropriate service class
3. **Create controller endpoints** in the appropriate controller
4. **Add validation** using Bean Validation annotations
5. **Test** the endpoints using tools like Postman or curl

## Production Deployment

For production deployment:

1. **Switch to PostgreSQL** by uncommenting the PostgreSQL configuration in `application.properties`
2. **Set up environment variables** for sensitive data
3. **Configure proper JWT secrets**
4. **Set up proper logging**
5. **Configure CORS** if needed for frontend integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.
