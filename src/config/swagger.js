const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Maruti Backend API',
      version: '1.0.0',
      description: 'A comprehensive Node.js Express API with best practices and documentation',
      contact: {
        name: 'Maruti Team',
        email: 'api@maruti.com',
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}${process.env.API_PREFIX || '/api/v1'}`,
        description: 'Development server',
      },
      {
        url: `https://api.maruti.com${process.env.API_PREFIX || '/api/v1'}`,
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
            error: {
              type: 'string',
              example: 'Detailed error information',
            },
          },
        },
        HealthCheck: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Server is healthy',
            },
            data: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  example: 'healthy',
                },
                timestamp: {
                  type: 'string',
                  format: 'date-time',
                  example: '2024-01-26T12:00:00Z',
                },
                uptime: {
                  type: 'number',
                  example: 3600.123,
                },
                environment: {
                  type: 'string',
                  example: 'development',
                },
                version: {
                  type: 'string',
                  example: '1.0.0',
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
    './src/models/*.js',
  ], // Path to the API files
};

const specs = swaggerJSDoc(options);

module.exports = specs; 