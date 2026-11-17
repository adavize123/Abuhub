/**
 * Auth Middleware
 * Middleware for protecting routes and verifying JWT tokens
 */

import { verifyToken } from '../utils/jwtUtils.js';
import prisma from '../config/prismaClient.js';

// Verify JWT token
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided',
      });
    }

    const { valid, decoded, error } = verifyToken(token);

    if (!valid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        error,
      });
    }

    // Fetch user and attach to request
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or account inactive',
      });
    }
    // avoid attaching sensitive fields
    const { password, ...publicUser } = user;
    req.user = publicUser;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error.message,
    });
  }
};

// Check if user is admin
export const adminMiddleware = (req, res, next) => {
  if (req.user?.role?.toString().toLowerCase() !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
  }
  next();
};

// Check if user is admin or moderator
export const moderatorMiddleware = (req, res, next) => {
  if (!['admin', 'moderator'].includes(String(req.user?.role).toLowerCase())) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Moderator or admin privileges required.',
    });
  }
  next();
};

// Optional auth - doesn't require token but attaches user if provided
export const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      const { valid, decoded } = verifyToken(token);

      if (valid) {
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (user && user.isActive) {
          const { password, ...publicUser } = user;
          req.user = publicUser;
          req.userId = decoded.userId;
        }
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next(); // Continue regardless of error
  }
};
