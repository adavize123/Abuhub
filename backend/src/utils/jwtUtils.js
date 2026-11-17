/**
 * JWT Utils
 * Token generation and verification utilities
 */

import jwt from 'jsonwebtoken';

export const generateToken = (userId, expiresIn = '7d') => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn });
};

export const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '30d',
  });

  return { accessToken, refreshToken };
};

export const verifyToken = (token, secret = process.env.JWT_SECRET) => {
  try {
    const decoded = jwt.verify(token, secret);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

