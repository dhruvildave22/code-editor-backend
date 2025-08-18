# Code Exam Backend

A Node.js REST API backend for a code examination platform built with Express.js, PostgreSQL, and JWT authentication.

## 🏗️ Architecture

This application follows a layered architecture pattern:

```
src/
├── app.js              # Express app configuration
├── server.js           # Server entry point
├── controllers/        # Request handlers
├── services/           # Business logic layer
├── repositories/       # Data access layer
├── models/            # Database models (Objection.js)
├── routes/            # API route definitions
├── middlewares/       # Custom middleware functions
├── validations/       # Request validation schemas
├── db/                # Database configuration
└── utils/             # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd code-exam-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://postgres:password@localhost:5433/codeexam
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=1h
   NODE_ENV=development
   PORT=5555
   ```

4. **Start the database**
   ```bash
   docker compose up -d
   ```

5. **Run database migrations**
   ```bash
   npm run migrate
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5555`

## 📊 Database

### Setup
- **Database**: PostgreSQL 16
- **ORM**: Objection.js with Knex.js
- **Migrations**: Located in `db/migrations/`
- **Seeds**: Located in `db/seeds/`

### Available Commands
```bash
npm run migrate        # Run pending migrations
npm run rollback      # Rollback last migration
npm run seed          # Run database seeds
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

- **Token expiration**: 1 hour (configurable)
- **Algorithm**: HS256
- **Payload includes**: user ID, email, role
- **Password hashing**: bcrypt with salt rounds = 10

## 🔧 Development

### Project Structure

```
src/
├── controllers/
│   └── user-controller.js     # User-related request handlers
├── services/
│   └── user-service.js        # User business logic
├── repositories/
│   └── user-repository.js     # User data access
├── models/
│   └── User.js               # User model definition
├── routes/
│   ├── health.js             # Health check routes
│   └── user-routes.js        # User-related routes
├── middlewares/
│   ├── auth-middleware.js    # JWT authentication
│   ├── authStub.js          # Auth stub for development
│   ├── error-handler.js     # Global error handling
│   ├── validation-middleware.js # Request validation
│   └── zodError.js          # Zod error handling
├── validations/
│   └── user-validation.js    # User validation schemas
└── db/
    └── knex.js              # Database configuration
```

### Available Scripts

```bash
npm run dev       # Start development server with nodemon
npm start         # Start production server
npm run migrate   # Run database migrations
npm run rollback  # Rollback last migration
npm run seed      # Run database seeds
```

### Middleware Stack

1. **JSON Parser**: Parses incoming JSON requests (1MB limit)
2. **Auth Stub**: Development authentication stub
3. **Route Handlers**: Application routes
4. **Validation Middleware**: Request validation using Zod
5. **Error Handler**: Global error handling

## 🧪 Testing

### Manual Testing with cURL

**Register a new user:**
```bash
curl -X POST http://localhost:5555/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "role": "candidate"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5555/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Health check:**
```bash
curl http://localhost:5555/health
```

## 🐳 Docker

The project includes a `docker-compose.yml` for local development:

- **PostgreSQL**: Available on port 5433
- **Adminer**: Database management UI on port 8081

## 📦 Dependencies

### Production Dependencies
- **express**: Web framework
- **objection**: SQL ORM
- **knex**: SQL query builder
- **pg**: PostgreSQL client
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT implementation
- **zod**: Schema validation
- **dotenv**: Environment variable management

### Development Dependencies
- **nodemon**: Development server with auto-reload

## 🚨 Error Handling

The application implements comprehensive error handling:

1. **Validation Errors**: 400 status with detailed field errors
2. **Authentication Errors**: 401 status for invalid credentials
3. **Conflict Errors**: 409 status for duplicate resources
4. **Server Errors**: 500 status for unexpected errors

## 🔒 Security Features

- **Password Hashing**: Uses bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Parameterized queries via Knex.js

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | Secret key for JWT signing | Required |
| `JWT_EXPIRES_IN` | JWT token expiration time | `1h` |
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5555` |

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Ensure all validations and tests pass
4. Submit a pull request
