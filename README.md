<<<<<<< HEAD
# Swift-Desk
A full-stack Ticketing System built with Java (Spring Boot) and Next.js, featuring role-based access control, secure authentication, and PostgreSQL integration. Designed for managing, tracking, and resolving IT support/customer service tickets efficiently.
=======
# Swift Desk - Ticketing System

A full-stack ticketing system built with Spring Boot (backend) and Next.js (frontend).

## Features

- **Authentication System**: JWT-based login/signup with role-based access control
- **User Roles**: Admin, Agent, and User with different permissions
- **Ticket Management**: Create, update, assign, and track tickets
- **Comment System**: Add comments to tickets for collaboration
- **Dashboard**: Role-specific dashboards with ticket overview
- **Responsive UI**: Modern, mobile-friendly interface

## Tech Stack

### Backend
- **Java 17** with Spring Boot 3.3.2
- **Spring Security** with JWT authentication
- **Spring Data JPA** with H2 (dev) / PostgreSQL (prod)
- **Maven/Gradle** build system
- **Lombok** for boilerplate reduction

### Frontend
# Swift Desk - Ticketing System

A full-stack Ticketing System built with Java (Spring Boot) and Next.js, featuring role-based access control, secure authentication, and PostgreSQL integration. Designed for managing, tracking, and resolving IT support/customer service tickets efficiently.

## Features

- **Authentication System**: JWT-based login/signup with role-based access control
- **User Roles**: Admin, Agent, and User with different permissions
- **Ticket Management**: Create, update, assign, and track tickets
- **Comment System**: Add comments to tickets for collaboration
- **Dashboard**: Role-specific dashboards with ticket overview
- **Responsive UI**: Modern, mobile-friendly interface

## Tech Stack

### Backend
- **Java 17** with Spring Boot 3.3.2
- **Spring Security** with JWT authentication
- **Spring Data JPA** with H2 (dev) / PostgreSQL (prod)
- **Gradle** build system
- **Lombok** for boilerplate reduction

### Frontend
- **Next.js 14** with TypeScript
- **Tailwind CSS** for styling
- **React Context** for state management
- **Axios** for API communication

## Quick Start

### Backend
```bash
cd backend
./gradlew bootRun
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Default Users

- **Admin**: admin / admin123
- **Agent**: agent / agent123
- **User**: user / user123

## API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user
- `GET /api/tickets` - Get tickets (with filters)
- `POST /api/tickets` - Create ticket
- `PUT /api/tickets/{id}` - Update ticket
- `POST /api/tickets/{id}/comments` - Add comment

## Environment Variables

### Backend
```properties
spring.datasource.url=jdbc:h2:mem:ticketing
app.jwt.secret=your-secret-key
server.port=8080
```

### Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Deployment

The application is ready for deployment on platforms like:
- Heroku
- Railway
- Render
- AWS/GCP/Azure

## License

MIT License
