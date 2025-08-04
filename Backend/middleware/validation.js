const { validationResult } = require('express-validator');

// @desc    Validate request data
// @access  Public
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

// @desc    Validate MongoDB ObjectId
// @access  Public
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  
  next();
};

// @desc    Validate pagination parameters
// @access  Public
const validatePagination = (req, res, next) => {
  const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;
  
  // Validate page
  const pageNum = parseInt(page);
  if (isNaN(pageNum) || pageNum < 1) {
    return res.status(400).json({
      success: false,
      message: 'Page must be a positive integer'
    });
  }
  
  // Validate limit
  const limitNum = parseInt(limit);
  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    return res.status(400).json({
      success: false,
      message: 'Limit must be between 1 and 100'
    });
  }
  
  // Validate sort order
  if (!['asc', 'desc'].includes(order)) {
    return res.status(400).json({
      success: false,
      message: 'Order must be either "asc" or "desc"'
    });
  }
  
  // Add validated values to request
  req.pagination = {
    page: pageNum,
    limit: limitNum,
    sort,
    order,
    skip: (pageNum - 1) * limitNum
  };
  
  next();
};

// @desc    Validate date range
// @access  Public
const validateDateRange = (req, res, next) => {
  const { startDate, endDate } = req.query;
  
  if (startDate) {
    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid start date format'
      });
    }
  }
  
  if (endDate) {
    const end = new Date(endDate);
    if (isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid end date format'
      });
    }
  }
  
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be after end date'
      });
    }
  }
  
  next();
};

// @desc    Validate file upload
// @access  Public
const validateFileUpload = (allowedTypes = [], maxSize = 5 * 1024 * 1024) => {
  return (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
      });
    }
    
    // Check file size
    if (req.file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: `File size too large. Maximum size: ${maxSize / (1024 * 1024)}MB`
      });
    }
    
    next();
  };
};

// @desc    Validate search query
// @access  Public
const validateSearchQuery = (req, res, next) => {
  const { q } = req.query;
  
  if (q && typeof q !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Search query must be a string'
    });
  }
  
  if (q && q.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Search query must be at least 2 characters long'
    });
  }
  
  next();
};

// @desc    Validate filter parameters
// @access  Public
const validateFilters = (allowedFilters = []) => {
  return (req, res, next) => {
    const filters = req.query;
    
    for (const [key, value] of Object.entries(filters)) {
      if (key !== 'page' && key !== 'limit' && key !== 'sort' && key !== 'order' && key !== 'q') {
        if (!allowedFilters.includes(key)) {
          return res.status(400).json({
            success: false,
            message: `Invalid filter parameter: ${key}`
          });
        }
      }
    }
    
    next();
  };
};

// @desc    Validate investment symbol
// @access  Public
const validateSymbol = (req, res, next) => {
  const { symbol } = req.params;
  
  if (!symbol || typeof symbol !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Symbol is required'
    });
  }
  
  // Basic symbol validation (alphanumeric, 1-10 characters)
  if (!/^[A-Z0-9]{1,10}$/.test(symbol.toUpperCase())) {
    return res.status(400).json({
      success: false,
      message: 'Invalid symbol format'
    });
  }
  
  // Normalize symbol to uppercase
  req.params.symbol = symbol.toUpperCase();
  
  next();
};

// @desc    Validate amount
// @access  Public
const validateAmount = (req, res, next) => {
  const { amount } = req.body;
  
  if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Amount must be a positive number'
    });
  }
  
  // Check for reasonable limits (adjust as needed)
  const numAmount = parseFloat(amount);
  if (numAmount > 1000000000) { // 1 billion
    return res.status(400).json({
      success: false,
      message: 'Amount exceeds maximum limit'
    });
  }
  
  next();
};

// @desc    Validate quantity
// @access  Public
const validateQuantity = (req, res, next) => {
  const { quantity } = req.body;
  
  if (!quantity || isNaN(quantity) || parseFloat(quantity) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Quantity must be a positive number'
    });
  }
  
  // Check for reasonable limits
  const numQuantity = parseFloat(quantity);
  if (numQuantity > 1000000) { // 1 million shares
    return res.status(400).json({
      success: false,
      message: 'Quantity exceeds maximum limit'
    });
  }
  
  next();
};

// @desc    Validate price
// @access  Public
const validatePrice = (req, res, next) => {
  const { price } = req.body;
  
  if (!price || isNaN(price) || parseFloat(price) < 0) {
    return res.status(400).json({
      success: false,
      message: 'Price must be a non-negative number'
    });
  }
  
  // Check for reasonable limits
  const numPrice = parseFloat(price);
  if (numPrice > 100000) { // $100,000 per share
    return res.status(400).json({
      success: false,
      message: 'Price exceeds maximum limit'
    });
  }
  
  next();
};

// @desc    Validate email format
// @access  Public
const validateEmail = (req, res, next) => {
  const { email } = req.body;
  
  if (!email || typeof email !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    });
  }
  
  next();
};

// @desc    Validate phone number
// @access  Public
const validatePhone = (req, res, next) => {
  const { phone } = req.body;
  
  if (phone && typeof phone === 'string') {
    const phoneRegex = /^\+?[\d\s-()]+$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      });
    }
  }
  
  next();
};

module.exports = {
  validate,
  validateObjectId,
  validatePagination,
  validateDateRange,
  validateFileUpload,
  validateSearchQuery,
  validateFilters,
  validateSymbol,
  validateAmount,
  validateQuantity,
  validatePrice,
  validateEmail,
  validatePhone
}; 