const packageJson = require('../../package.json');

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check the health status of the server and its dependencies
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
 *       503:
 *         description: Server is unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const healthCheck = async (req, res) => {
  try {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: packageJson.version,
      memory: {
        used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
        total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
        external: Math.round((process.memoryUsage().external / 1024 / 1024) * 100) / 100,
      },
      cpu: {
        user: process.cpuUsage().user,
        system: process.cpuUsage().system,
      },
    };

    // Additional health checks can be added here
    // For example: database connectivity, external service status, etc.

    res.status(200).json({
      success: true,
      message: 'Server is healthy',
      data: healthData,
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Server health check failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
};

/**
 * @swagger
 * /health/detailed:
 *   get:
 *     summary: Detailed health check endpoint
 *     description: Get detailed health information including database and external services
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Detailed server health information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     server:
 *                       $ref: '#/components/schemas/HealthCheck/properties/data'
 *                     database:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                         latency:
 *                           type: number
 *                     services:
 *                       type: object
 */
const detailedHealthCheck = async (req, res) => {
  try {
    const healthData = {
      server: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: packageJson.version,
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        memory: {
          used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
          total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
          external: Math.round((process.memoryUsage().external / 1024 / 1024) * 100) / 100,
          rss: Math.round((process.memoryUsage().rss / 1024 / 1024) * 100) / 100,
        },
        cpu: process.cpuUsage(),
      },
      database: {
        status: 'not_connected', // Will be updated when database is configured
        latency: null,
      },
      services: {
        // Add external service health checks here
      },
    };

    res.status(200).json({
      success: true,
      message: 'Detailed server health information',
      data: healthData,
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Detailed health check failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
};

module.exports = {
  healthCheck,
  detailedHealthCheck,
}; 