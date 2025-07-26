# Maruti Backend API

A comprehensive Node.js Express API for shop management, featuring user authentication, customer management, reference tracking, and role-based access control with complete documentation.

## 🚀 Features

- **Express.js Framework** - Fast, minimal web framework
- **PostgreSQL Database** - Reliable relational database with Sequelize ORM
- **Customer Management** - Complete customer lifecycle management
- **Reference Tracking** - Track and manage customer referral sources
- **Product Catalog** - Comprehensive product inventory management
- **User Authentication** - JWT-based authentication system
- **Role-Based Access** - Admin and Employee roles with proper authorization
- **Data Relationships** - Foreign key constraints with referential integrity
- **Input Validation** - Comprehensive request validation using Joi
- **Security First** - Helmet, CORS, and other security middleware
- **API Documentation** - Interactive Swagger/OpenAPI documentation
- **Code Quality** - ESLint and Prettier for consistent code formatting
- **Error Handling** - Centralized error handling middleware
- **Environment Management** - Secure environment variable handling
- **Health Monitoring** - Health check endpoints for system monitoring

## 📁 Project Structure

```
maruti-be/
├── src/
│   ├── config/
│   │   ├── app.js              # Express app configuration
│   │   ├── config.js           # Sequelize database configuration
│   │   ├── database.js         # Database connection setup
│   │   └── swagger.js          # Swagger documentation setup
│   ├── controllers/
│   │   ├── authController.js   # Authentication logic
│   │   ├── healthController.js # Health check handlers
│   │   ├── userController.js   # User management logic
│   │   ├── referenceController.js # Reference management logic
│   │   ├── customerController.js  # Customer management logic
│   │   └── productController.js   # Product management logic
│   ├── docs/                   # Modular Swagger documentation
│   │   ├── auth.swagger.json   # Authentication endpoints docs
│   │   ├── health.swagger.json # Health endpoints docs
│   │   ├── users.swagger.json  # User management endpoints docs
│   │   ├── references.swagger.json # Reference management endpoints docs
│   │   ├── customers.swagger.json  # Customer management endpoints docs
│   │   ├── products.swagger.json   # Product management endpoints docs
│   │   ├── swagger-config.json # Base Swagger configuration
│   │   └── README.md          # Documentation structure guide
│   ├── middleware/
│   │   ├── auth.js            # Authentication & authorization
│   │   ├── errorHandler.js    # Global error handling
│   │   ├── notFound.js        # 404 error handling
│   │   └── validation.js      # Request validation middleware
│   ├── migrations/            # Database migration files
│   │   └── 20250726114449-create-user.js
│   ├── models/                # Sequelize models
│   │   ├── index.js          # Model loader
│   │   ├── user.js           # User model definition
│   │   ├── reference.js      # Reference model definition
│   │   ├── customer.js       # Customer model definition
│   │   └── product.js        # Product model definition
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   ├── health.js         # Health check routes
│   │   ├── users.js          # User management routes
│   │   ├── references.js     # Reference management routes
│   │   ├── customers.js      # Customer management routes
│   │   └── products.js       # Product management routes
│   ├── seeders/              # Database seeders
│   │   └── 20250726115531-create-admin-user.js
│   ├── services/             # Business logic services
│   ├── utils/
│   │   ├── constants.js      # Application constants
│   │   └── swaggerMerger.js  # Swagger documentation merger
│   ├── validators/
│   │   ├── authValidators.js # Authentication validation schemas
│   │   ├── userValidators.js # User validation schemas
│   │   ├── referenceValidators.js # Reference validation schemas
│   │   ├── customerValidators.js  # Customer validation schemas
│   │   └── productValidators.js   # Product validation schemas
│   └── server.js             # Application entry point
├── .env                      # Environment variables (not in git)
├── .env.example             # Environment variables template
├── .eslintrc.js             # ESLint configuration
├── .gitignore              # Git ignore patterns
├── .prettierrc             # Prettier configuration
├── .prettierignore         # Prettier ignore patterns
├── .sequelizerc            # Sequelize CLI configuration
├── eslint.config.js        # Modern ESLint configuration
├── package.json            # Project dependencies and scripts
└── README.md              # Project documentation
```

## 🛠️ Prerequisites

- **Node.js** (v16.18.0 or higher)
- **npm** (v8.19.2 or higher)
- **PostgreSQL** (v12 or higher)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/maruti-company/maruti-be.git
cd maruti-be
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Update the `.env` file with your database credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=maruti_db
DB_USER=maruti_user
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=24h

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 3. Database Setup

```bash
# Create database and user in PostgreSQL
createdb maruti_db
psql -c "CREATE USER maruti_user WITH PASSWORD 'your_password';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE maruti_db TO maruti_user;"

# Run migrations to create tables
npm run db:migrate

# Seed initial admin user
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with auto-reload |
| `npm run lint` | Run ESLint to check code quality |
| `npm run lint:check` | Check for linting issues without fixing |
| `npm run format` | Format code using Prettier |
| `npm run format:check` | Check code formatting without fixing |
| `npm run format:all` | Format all supported files |
| `npm run pre-commit` | Run linting and formatting (for git hooks) |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Run database seeders |

## 🔗 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login

### User Management (Admin Only)
- `GET /api/v1/users` - Get all users (with pagination & name filtering)
- `POST /api/v1/users` - Create new user
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Reference Management (Admin & Employee)
- `GET /api/v1/references` - Get all references (with pagination, category & search filtering)
- `GET /api/v1/references/categories` - Get all available reference categories
- `POST /api/v1/references` - Create new reference
- `GET /api/v1/references/:id` - Get reference by ID with customers
- `PUT /api/v1/references/:id` - Update reference
- `DELETE /api/v1/references/:id` - Delete reference (Admin only)

### Customer Management (Admin & Employee)
- `GET /api/v1/customers` - Get all customers (with pagination, reference & search filtering)
- `POST /api/v1/customers` - Create new customer
- `GET /api/v1/customers/:id` - Get customer by ID with reference
- `PUT /api/v1/customers/:id` - Update customer
- `DELETE /api/v1/customers/:id` - Delete customer (Admin only)

### Product Management (Admin & Employee)
- `GET /api/v1/products` - Get all products (with pagination, unit & name filtering)
- `GET /api/v1/products/units` - Get all available product units
- `POST /api/v1/products` - Create new product
- `GET /api/v1/products/:id` - Get product by ID
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product (Admin only)

### Health Monitoring
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed system health

## 👥 User System

### Default Admin Account
After running the seeder, you can login with:
- **Email**: `admin@maruti.com`
- **Password**: `admin123`

⚠️ **Important**: Change this password immediately in production!

### User Roles
- **Admin (1)**: Can create, read, update, delete users and other admins
- **Employee (2)**: Standard user role (can only login and access authorized endpoints)

### Authentication Flow
1. User logs in with email/password via `POST /api/v1/auth/login`
2. Server validates credentials and returns JWT token
3. Client includes token in Authorization header: `Bearer <token>`
4. Server validates token on protected routes
5. Admin-only routes check user role for authorization

## 🏪 Business Modules

### Reference Management
Manage people who refer customers to your shop:
- **Categories**: Carpenter, Interior Designer, Dealer, Builder, Direct/Walking, Staff, Relation, Other
- **Fields**: Name (required), Mobile Number (optional), Category (required)
- **Features**: Pagination, category filtering, search filtering (name & mobile), customer association tracking
- **Business Logic**: Cannot delete references with associated customers

### Customer Management
Core customer data management:
- **Fields**: Name (required), Mobile Number (required), Address (optional), Reference (optional)
- **Features**: Pagination, reference filtering, search filtering (name & mobile), reference relationship tracking
- **Validation**: Mobile number format validation, reference existence verification

### Data Relationships
- **One-to-Many**: Reference → Customers
- **Foreign Key**: Customer.reference_id → Reference.id
- **Constraints**: RESTRICT on delete (protects data integrity), CASCADE on update

### Product Catalog
Manage your shop's product inventory:
- **Fields**: Name (required), Description (optional), Unit (required)
- **Units**: BOX, CU.FEET, CDM, DOZEN, KGS, METER, PCS, R.FEET, SET, SQ.MT, SQ.FT, SQ.FT (Inches)
- **Features**: Pagination, unit filtering, name filtering, comprehensive validation
- **Validation**: Name length (2-200 chars), description length (max 1000 chars), unit validation

## 📚 API Documentation

Interactive API documentation is available at:
- **Development**: `http://localhost:3000/api-docs`
- **Production**: `https://api.maruti.com/api-docs`

The documentation is built using modular JSON files for better maintainability.

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `maruti_db` |
| `DB_USER` | Database username | `maruti_user` |
| `DB_PASSWORD` | Database password | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | `24h` |

### Database Configuration

The application uses PostgreSQL with Sequelize ORM. Configuration is environment-specific:
- **Development**: Includes SQL logging
- **Test**: Minimal logging for testing
- **Production**: Connection pooling and no logging

## 🛡️ Security Features

- **Helmet.js** - Sets various HTTP headers for security
- **CORS** - Cross-Origin Resource Sharing configuration
- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for secure password storage
- **Input Validation** - Joi schema validation for all inputs
- **Role-Based Access** - Granular permission system
- **Environment Variables** - Sensitive data protection

## 🧪 Testing

```bash
# Run tests (when test suite is added)
npm test

# Run tests with coverage
npm run test:coverage
```

## 📦 Dependencies

### Production Dependencies
- **express**: Web framework
- **sequelize**: ORM for PostgreSQL
- **pg**: PostgreSQL driver
- **jsonwebtoken**: JWT implementation
- **bcryptjs**: Password hashing
- **joi**: Data validation
- **helmet**: Security middleware
- **cors**: CORS middleware
- **morgan**: HTTP request logger
- **dotenv**: Environment variables
- **swagger-jsdoc**: Swagger documentation
- **swagger-ui-express**: Swagger UI

### Development Dependencies
- **nodemon**: Development server with auto-reload
- **eslint**: Code linting
- **prettier**: Code formatting
- **sequelize-cli**: Database migrations and seeders

## 🔄 Development Workflow

1. **Feature Development**
   - Create feature branch
   - Implement changes following project structure
   - Add appropriate validation and error handling
   - Update Swagger documentation
   - Run linting and formatting

2. **Database Changes**
   - Create migration files using Sequelize CLI
   - Update models accordingly
   - Test migration and rollback

3. **Code Quality**
   - All code must pass ESLint checks
   - Use Prettier for consistent formatting
   - Follow existing patterns and conventions

## 🌟 Best Practices

- **Modular Architecture** - Separation of concerns
- **Error Handling** - Centralized error management
- **Security First** - Multiple layers of security
- **Documentation** - Comprehensive API documentation
- **Code Quality** - Automated linting and formatting
- **Environment Management** - Secure configuration handling
- **Database Management** - Migration-based schema changes

## 🗺️ Roadmap

- [ ] Unit and integration tests
- [ ] Rate limiting
- [ ] Email notifications
- [ ] File upload functionality
- [ ] Audit logging
- [ ] Advanced role permissions
- [ ] API versioning strategy
- [ ] Performance monitoring
- [ ] Docker containerization
- [ ] CI/CD pipeline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow coding standards and run tests
4. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Team

Developed by the Maruti Development Team

---

For more information, please contact the development team or refer to the API documentation. 