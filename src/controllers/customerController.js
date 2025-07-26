const { Customer, Reference } = require('../models');
const { Op } = require('sequelize');
const { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES, PAGINATION } = require('../utils/constants');

/**
 * Create a new customer
 */
const createCustomer = async (req, res) => {
  try {
    const { name, mobile_no, address, reference_id } = req.body;

    // If reference_id is provided, verify it exists
    if (reference_id) {
      const referenceExists = await Reference.findByPk(reference_id);
      if (!referenceExists) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Reference not found',
        });
      }
    }

    // Create new customer
    const newCustomer = await Customer.create({
      name,
      mobile_no,
      address,
      reference_id,
    });

    // Fetch the created customer with reference details
    const customerWithReference = await Customer.findByPk(newCustomer.id, {
      include: [
        {
          model: Reference,
          as: 'reference',
          attributes: ['id', 'name', 'category'],
          required: false,
        },
      ],
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Customer created successfully',
      data: {
        customer: customerWithReference,
      },
    });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * Get all customers with pagination and filtering
 */
const getCustomers = async (req, res) => {
  try {
    // Use validated values with fallback to constants
    const page = parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE;
    const limit = parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT;
    const { reference_id, search } = req.query;

    // Ensure values are valid numbers
    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), PAGINATION.MAX_LIMIT);

    const offset = (validPage - 1) * validLimit;

    // Build where clause for filtering
    const whereClause = {};
    if (reference_id) {
      whereClause.reference_id = reference_id;
    }
    if (search) {
      whereClause[Op.or] = [
        {
          name: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          mobile_no: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    const { count, rows: customers } = await Customer.findAndCountAll({
      where: whereClause,
      limit: validLimit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Reference,
          as: 'reference',
          attributes: ['id', 'name', 'category'],
          required: false,
        },
      ],
    });

    const totalPages = Math.ceil(count / validLimit);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Customers retrieved successfully',
      data: {
        customers,
        pagination: {
          page: validPage,
          limit: validLimit,
          total: count,
          pages: totalPages,
          hasNext: validPage < totalPages,
          hasPrev: validPage > 1,
        },
      },
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * Get customer by ID
 */
const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByPk(id, {
      include: [
        {
          model: Reference,
          as: 'reference',
          attributes: ['id', 'name', 'category', 'mobile_no'],
          required: false,
        },
      ],
    });

    if (!customer) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Customer not found',
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Customer retrieved successfully',
      data: {
        customer,
      },
    });
  } catch (error) {
    console.error('Get customer by ID error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * Update customer
 */
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find customer
    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Customer not found',
      });
    }

    // If reference_id is being updated, verify it exists
    if (updateData.reference_id && updateData.reference_id !== customer.reference_id) {
      const referenceExists = await Reference.findByPk(updateData.reference_id);
      if (!referenceExists) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Reference not found',
        });
      }
    }

    // Update customer
    await customer.update(updateData);

    // Fetch updated customer with reference details
    const updatedCustomer = await Customer.findByPk(id, {
      include: [
        {
          model: Reference,
          as: 'reference',
          attributes: ['id', 'name', 'category'],
          required: false,
        },
      ],
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Customer updated successfully',
      data: {
        customer: updatedCustomer,
      },
    });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * Delete customer (Admin only)
 */
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    // Find customer
    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Customer not found',
      });
    }

    // Delete customer
    await customer.destroy();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Customer deleted successfully',
    });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
