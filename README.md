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
├── errors/            # Custom error classes
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
   POSTGRES_USER=dev
   POSTGRES_PASSWORD=devpass
   POSTGRES_DB=code_exam
   DATABASE_URL=postgres://dev:devpass@localhost:5433/code_exam
   PORT=5555
   JWT_SECRET=dev-dev-dev
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=admin1234
   ```
   
4. **Start the database**
   ```bash
   docker compose up -d
   ```
   
   💡 **Note (macOS DNS issue):**  
   If you face DNS resolution issues while pulling Docker images, try updating your DNS settings:
   
   - Go to **System Settings > Network > Advanced > DNS**
   - Add `1.1.1.1` (Cloudflare DNS)

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
├── errors/
│   ├── base-client-error.js # Base class for 4xx errors
│   ├── bad-request-error.js # 400 Bad Request errors
│   ├── unauthorized-error.js # 401 Unauthorized errors
│   ├── forbidden-error.js   # 403 Forbidden errors
│   ├── not-found-error.js   # 404 Not Found errors
│   ├── conflict-error.js    # 409 Conflict errors
│   ├── validation-error.js  # 422 Validation errors
│   ├── server-error.js      # 5xx Server errors
│   └── index.js            # Error exports
├── validations/
│   └── user-validation.js    # User validation schemas
├── utils/
│   └── error-utils.js       # Error utility functions
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

The application implements a comprehensive custom error handling system with structured error responses:

### **Custom Error Classes**

The application uses custom error classes for consistent error handling:

#### **Client Errors (4xx)**
- **BadRequestError (400)**: Invalid request data
- **UnauthorizedError (401)**: Authentication required or failed
- **ForbiddenError (403)**: Access denied to resource
- **NotFoundError (404)**: Resource not found
- **ConflictError (409)**: Resource already exists or conflicts
- **ValidationError (422)**: Request validation failed

#### **Server Errors (5xx)**
- **ServerError (500+)**: Internal server errors

### **Error Response Format**

All errors return consistent JSON responses:

```json
{
  "error": "Human readable error message",
  "code": "ERROR_TYPE_CODE",
  "errorCode": "SPECIFIC_ERROR_CODE"
}
```

**Example responses:**

```json
// Validation Error
{
  "error": "Invalid email format",
  "details": [
    {
      "path": ["email"],
      "message": "Invalid email format"
    }
  ]
}

// Conflict Error
{
  "error": "Email already registered",
  "code": "CONFLICT_ERROR",
  "errorCode": "EMAIL_ALREADY_EXISTS"
}

// Authentication Error
{
  "error": "Invalid credentials",
  "code": "UNAUTHORIZED_ERROR",
  "errorCode": "INVALID_CREDENTIALS"
}
```

### **Error Handling Flow**

1. **Custom Errors**: Thrown by services using specific error classes
2. **Validation Errors**: Caught by Zod validation middleware
3. **Database Errors**: Handled for common PostgreSQL constraints
4. **JWT Errors**: Token validation and expiration handling
5. **Global Handler**: Catches unhandled errors and returns 500

### **Common Error Codes**

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `EMAIL_ALREADY_EXISTS` | 409 | User registration with existing email |
| `INVALID_CREDENTIALS` | 401 | Login with wrong email/password |
| `INVALID_USER_TYPE` | 400 | Invalid role in registration |
| `USER_NOT_FOUND` | 404 | User lookup failed |
| `VALIDATION_ERROR` | 400/422 | Request validation failed |
| `INVALID_TOKEN` | 401 | JWT token invalid or expired |
| `ACCESS_DENIED` | 403 | Insufficient permissions |

### **Using Custom Errors in Development**

When developing new features, use the custom error classes for consistent error handling:

```javascript
// Import errors
const { ConflictError, NotFoundError, BadRequestError } = require('../errors');

// Throw specific errors
throw new ConflictError('Resource already exists', 'RESOURCE_EXISTS');
throw new NotFoundError('User not found', 'USER_NOT_FOUND');
throw new BadRequestError('Invalid input', 'INVALID_INPUT');

// Or use error utilities
const ErrorUtils = require('../utils/error-utils');
ErrorUtils.userNotFound();
ErrorUtils.emailAlreadyExists();
ErrorUtils.invalidCredentials();
```

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
