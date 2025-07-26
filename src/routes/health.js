const express = require('express');
const { healthCheck, detailedHealthCheck } = require('../controllers/healthController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Health check endpoints for monitoring server status
 */

// Basic health check
router.get('/', healthCheck);

// Detailed health check
router.get('/detailed', detailedHealthCheck);

module.exports = router; 