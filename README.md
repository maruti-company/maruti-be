# Maruti Backend API

A robust, scalable Node.js Express backend API with comprehensive documentation, linting, formatting, and best practices.

## 🚀 Features

- **Modern Architecture**: Clean, modular folder structure following industry best practices
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation
- **Code Quality**: ESLint + Prettier for consistent code formatting
- **Security**: Helmet.js for security headers, CORS configuration
- **Health Monitoring**: Comprehensive health check endpoints
- **Error Handling**: Centralized error handling with detailed logging
- **Environment Configuration**: Flexible environment-based configuration
- **Development Tools**: Hot reload with Nodemon

## 📁 Project Structure

```
maruti-be/
├── src/
│   ├── config/          # Configuration files
│   │   ├── app.js       # Express app configuration
│   │   ├── database.js  # Database configuration
│   │   └── swagger.js   # Swagger documentation config
│   ├── controllers/     # Route controllers
│   │   └── healthController.js
│   ├── middleware/      # Custom middleware
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   ├── models/          # Data models (to be added)
│   ├── routes/          # API routes
│   │   └── health.js
│   ├── services/        # Business logic services (to be added)
│   ├── utils/           # Utility functions (to be added)
│   ├── validators/      # Input validation (to be added)
│   ├── docs/            # Additional documentation
│   └── server.js        # Main server entry point
├── tests/
│   ├── unit/           # Unit tests (to be added)
│   └── integration/    # Integration tests (to be added)
├── logs/               # Application logs
├── .env.example        # Environment variables template
├── .eslintrc.js        # ESLint configuration
├── .prettierrc         # Prettier configuration
├── .prettierignore     # Prettier ignore rules
├── .gitignore          # Git ignore rules
└── package.json        # Project dependencies and scripts
```

## 🛠 Prerequisites

- Node.js (>= 16.0.0)
- npm (>= 8.0.0)

## ⚡ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/maruti-company/maruti-be.git
   cd maruti-be
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - API: http://localhost:3000
   - Documentation: http://localhost:3000/api-docs
   - Health Check: http://localhost:3000/health

## 📝 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm run lint` - Run ESLint and fix issues
- `npm run lint:check` - Check linting without fixing
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check formatting without fixing
- `npm run format:all` - Format and lint code
- `npm run pre-commit` - Run formatting and linting (pre-commit hook)

## 🌐 API Endpoints

### Health Check
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed health information

### API Base
- `GET /` - Welcome message and API information
- `GET /api-docs` - Swagger API documentation

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=maruti_db
DB_USER=maruti_user
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# API Configuration
API_PREFIX=/api/v1

# Logging
LOG_LEVEL=info
```

### ESLint & Prettier

The project is configured with:
- **ESLint**: For code linting with Node.js specific rules
- **Prettier**: For consistent code formatting
- **Pre-commit hooks**: Automatic formatting and linting

## 📚 API Documentation

The API documentation is automatically generated using Swagger/OpenAPI. Visit `/api-docs` when the server is running to explore the interactive documentation.

## 🛡 Security Features

- **Helmet.js**: Sets various HTTP headers for security
- **CORS**: Configurable Cross-Origin Resource Sharing
- **Input validation**: Prepared for request validation
- **Environment variables**: Sensitive data protection

## 🚦 Health Monitoring

The application includes comprehensive health check endpoints:

- **Basic Health Check** (`/health`): Server status, uptime, memory usage
- **Detailed Health Check** (`/health/detailed`): Extended system information

## 🧪 Testing

Testing structure is prepared with directories for:
- Unit tests (`tests/unit/`)
- Integration tests (`tests/integration/`)

*Test implementation coming soon.*

## 📦 Dependencies

### Production Dependencies
- **express**: Web framework
- **cors**: CORS middleware
- **helmet**: Security middleware
- **morgan**: HTTP request logger
- **dotenv**: Environment variable loader
- **swagger-jsdoc**: Swagger specification generator
- **swagger-ui-express**: Swagger UI middleware

### Development Dependencies
- **eslint**: JavaScript linter
- **prettier**: Code formatter
- **nodemon**: Development server with hot reload

## 🔄 Development Workflow

1. **Code**: Write your code following the established patterns
2. **Format**: Run `npm run format:all` to format and lint
3. **Test**: Run tests (coming soon)
4. **Commit**: Git hooks will ensure code quality
5. **Deploy**: Use `npm start` for production

## 🌟 Best Practices

- **Modular Architecture**: Separation of concerns with clear folder structure
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Security**: Security-first approach with proper middleware
- **Documentation**: Self-documenting code with Swagger
- **Code Quality**: Consistent formatting and linting
- **Environment Configuration**: Flexible configuration management

## 🔮 Roadmap

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Authentication & Authorization
- [ ] User management APIs
- [ ] File upload handling
- [ ] Rate limiting
- [ ] API versioning
- [ ] Comprehensive testing suite
- [ ] CI/CD pipeline
- [ ] Docker containerization
- [ ] Production deployment guides

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run format:all` to ensure code quality
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 👥 Team

Developed by the Maruti Team

---

For more information or support, please contact the development team. 