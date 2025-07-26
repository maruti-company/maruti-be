const express = require('express');
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { validateBody, validateParams, validateQuery } = require('../middleware/validation');
const {
  createUserValidator,
  updateUserValidator,
  getUsersValidator,
  userIdValidator,
} = require('../validators/userValidators');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Apply admin authorization to all routes (only admins can manage users)
router.use(requireAdmin);

// GET /users - Get all users with pagination
router.get('/', validateQuery(getUsersValidator), getUsers);

// POST /users - Create new user
router.post('/', validateBody(createUserValidator), createUser);

// GET /users/:id - Get user by ID
router.get('/:id', validateParams(userIdValidator), getUserById);

// PUT /users/:id - Update user
router.put('/:id', validateParams(userIdValidator), validateBody(updateUserValidator), updateUser);

// DELETE /users/:id - Delete user
router.delete('/:id', validateParams(userIdValidator), deleteUser);

module.exports = router;
