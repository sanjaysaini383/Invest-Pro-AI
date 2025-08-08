const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// JWT configuration
const JWT_CONFIG = {
  accessTokenSecret: process.env.JWT_SECRET || 'your-access-token-secret',
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-token-secret',
  accessTokenExpire: process.env.JWT_EXPIRE || '15m',
  refreshTokenExpire: process.env.JWT_REFRESH_EXPIRE || '30d'
};

// Generate single token (for backward compatibility)
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_CONFIG.accessTokenSecret, {
    expiresIn: JWT_CONFIG.accessTokenExpire
  });
};

// Generate access and refresh tokens
const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, JWT_CONFIG.accessTokenSecret, {
    expiresIn: JWT_CONFIG.accessTokenExpire
  });

  const refreshToken = jwt.sign(
    { ...payload, type: 'refresh' },
    JWT_CONFIG.refreshTokenSecret,
    { expiresIn: JWT_CONFIG.refreshTokenExpire }
  );

  return { accessToken, refreshToken };
};

// Verify access token
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_CONFIG.accessTokenSecret);
  } catch (error) {
    throw error;
  }
};

// Verify refresh token
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_CONFIG.refreshTokenSecret);
  } catch (error) {
    throw error;
  }
};

// Decode token without verification (for debugging)
const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateToken,
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
  JWT_CONFIG
};
