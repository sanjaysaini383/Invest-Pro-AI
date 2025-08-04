const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Generate a random string of specified length
 * @param {number} length - Length of the string to generate
 * @returns {string} Random string
 */
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate a random number between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Hash a string using bcrypt
 * @param {string} text - Text to hash
 * @param {number} saltRounds - Number of salt rounds
 * @returns {Promise<string>} Hashed string
 */
const hashString = async (text, saltRounds = 12) => {
  return await bcrypt.hash(text, saltRounds);
};

/**
 * Compare a string with a hash
 * @param {string} text - Text to compare
 * @param {string} hash - Hash to compare against
 * @returns {Promise<boolean>} True if match
 */
const compareHash = async (text, hash) => {
  return await bcrypt.compare(text, hash);
};

/**
 * Generate JWT token
 * @param {Object} payload - Token payload
 * @param {string} secret - JWT secret
 * @param {string} expiresIn - Expiration time
 * @returns {string} JWT token
 */
const generateJWT = (payload, secret, expiresIn = '7d') => {
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @param {string} secret - JWT secret
 * @returns {Object} Decoded token
 */
const verifyJWT = (token, secret) => {
  return jwt.verify(token, secret);
};

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @param {string} locale - Locale for formatting
 * @returns {string} Formatted currency
 */
const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
};

/**
 * Format percentage
 * @param {number} value - Value to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage
 */
const formatPercentage = (value, decimals = 2) => {
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Format number with commas
 * @param {number} number - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number
 */
const formatNumber = (number, decimals = 0) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number);
};

/**
 * Calculate percentage change
 * @param {number} oldValue - Old value
 * @param {number} newValue - New value
 * @returns {number} Percentage change
 */
const calculatePercentageChange = (oldValue, newValue) => {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
};

/**
 * Calculate compound annual growth rate (CAGR)
 * @param {number} startValue - Starting value
 * @param {number} endValue - Ending value
 * @param {number} years - Number of years
 * @returns {number} CAGR
 */
const calculateCAGR = (startValue, endValue, years) => {
  if (years <= 0 || startValue <= 0) return 0;
  return Math.pow(endValue / startValue, 1 / years) - 1;
};

/**
 * Calculate simple moving average
 * @param {Array<number>} values - Array of values
 * @param {number} period - Period for moving average
 * @returns {Array<number>} Moving averages
 */
const calculateSMA = (values, period) => {
  const sma = [];
  for (let i = period - 1; i < values.length; i++) {
    const sum = values.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    sma.push(sum / period);
  }
  return sma;
};

/**
 * Calculate exponential moving average
 * @param {Array<number>} values - Array of values
 * @param {number} period - Period for moving average
 * @returns {Array<number>} Moving averages
 */
const calculateEMA = (values, period) => {
  const ema = [];
  const multiplier = 2 / (period + 1);
  
  // First EMA is SMA
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += values[i];
  }
  ema.push(sum / period);
  
  // Calculate subsequent EMAs
  for (let i = period; i < values.length; i++) {
    const newEMA = (values[i] * multiplier) + (ema[ema.length - 1] * (1 - multiplier));
    ema.push(newEMA);
  }
  
  return ema;
};

/**
 * Calculate relative strength index (RSI)
 * @param {Array<number>} prices - Array of prices
 * @param {number} period - Period for RSI calculation
 * @returns {Array<number>} RSI values
 */
const calculateRSI = (prices, period = 14) => {
  const rsi = [];
  const gains = [];
  const losses = [];
  
  // Calculate price changes
  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }
  
  // Calculate initial average gain and loss
  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
  
  // Calculate RSI
  for (let i = period; i < prices.length; i++) {
    const rs = avgGain / avgLoss;
    const rsiValue = 100 - (100 / (1 + rs));
    rsi.push(rsiValue);
    
    // Update averages
    avgGain = ((avgGain * (period - 1)) + gains[i - 1]) / period;
    avgLoss = ((avgLoss * (period - 1)) + losses[i - 1]) / period;
  }
  
  return rsi;
};

/**
 * Calculate standard deviation
 * @param {Array<number>} values - Array of values
 * @returns {number} Standard deviation
 */
const calculateStandardDeviation = (values) => {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(variance);
};

/**
 * Calculate Sharpe ratio
 * @param {Array<number>} returns - Array of returns
 * @param {number} riskFreeRate - Risk-free rate
 * @returns {number} Sharpe ratio
 */
const calculateSharpeRatio = (returns, riskFreeRate = 0.02) => {
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const stdDev = calculateStandardDeviation(returns);
  return (avgReturn - riskFreeRate) / stdDev;
};

/**
 * Calculate maximum drawdown
 * @param {Array<number>} values - Array of values
 * @returns {Object} Maximum drawdown information
 */
const calculateMaxDrawdown = (values) => {
  let maxDrawdown = 0;
  let peak = values[0];
  let peakIndex = 0;
  let drawdownStart = 0;
  let drawdownEnd = 0;
  
  for (let i = 1; i < values.length; i++) {
    if (values[i] > peak) {
      peak = values[i];
      peakIndex = i;
    } else {
      const drawdown = (peak - values[i]) / peak;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
        drawdownStart = peakIndex;
        drawdownEnd = i;
      }
    }
  }
  
  return {
    maxDrawdown,
    drawdownStart,
    drawdownEnd,
    recoveryTime: drawdownEnd - drawdownStart
  };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s-()]+$/;
  return phoneRegex.test(phone);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const isValid = password.length >= minLength && 
                  hasUpperCase && 
                  hasLowerCase && 
                  hasNumbers && 
                  hasSpecialChar;
  
  return {
    isValid,
    errors: {
      tooShort: password.length < minLength,
      noUpperCase: !hasUpperCase,
      noLowerCase: !hasLowerCase,
      noNumbers: !hasNumbers,
      noSpecialChar: !hasSpecialChar
    }
  };
};

/**
 * Sanitize HTML content
 * @param {string} html - HTML content to sanitize
 * @returns {string} Sanitized HTML
 */
const sanitizeHTML = (html) => {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add
 * @returns {string} Truncated text
 */
const truncateText = (text, length = 100, suffix = '...') => {
  if (text.length <= length) return text;
  return text.substring(0, length) + suffix;
};

/**
 * Convert string to title case
 * @param {string} str - String to convert
 * @returns {string} Title case string
 */
const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

/**
 * Generate slug from string
 * @param {string} str - String to convert to slug
 * @returns {string} Slug
 */
const generateSlug = (str) => {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

/**
 * Merge objects deeply
 * @param {...Object} objects - Objects to merge
 * @returns {Object} Merged object
 */
const deepMerge = (...objects) => {
  const result = {};
  
  objects.forEach(obj => {
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          result[key] = deepMerge(result[key] || {}, obj[key]);
        } else {
          result[key] = obj[key];
        }
      });
    }
  });
  
  return result;
};

/**
 * Get nested object property safely
 * @param {Object} obj - Object to search
 * @param {string} path - Property path (e.g., 'user.profile.name')
 * @param {*} defaultValue - Default value if property not found
 * @returns {*} Property value or default
 */
const getNestedProperty = (obj, path, defaultValue = undefined) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : defaultValue;
  }, obj);
};

/**
 * Set nested object property
 * @param {Object} obj - Object to modify
 * @param {string} path - Property path
 * @param {*} value - Value to set
 * @returns {Object} Modified object
 */
const setNestedProperty = (obj, path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => {
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    return current[key];
  }, obj);
  
  target[lastKey] = value;
  return obj;
};

module.exports = {
  generateRandomString,
  generateRandomNumber,
  hashString,
  compareHash,
  generateJWT,
  verifyJWT,
  formatCurrency,
  formatPercentage,
  formatNumber,
  calculatePercentageChange,
  calculateCAGR,
  calculateSMA,
  calculateEMA,
  calculateRSI,
  calculateStandardDeviation,
  calculateSharpeRatio,
  calculateMaxDrawdown,
  isValidEmail,
  isValidPhone,
  validatePassword,
  sanitizeHTML,
  truncateText,
  toTitleCase,
  generateSlug,
  debounce,
  throttle,
  deepClone,
  deepMerge,
  getNestedProperty,
  setNestedProperty
}; 