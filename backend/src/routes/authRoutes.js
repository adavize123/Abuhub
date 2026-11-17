/**
 * Auth Routes
 * Authentication endpoints
 */

import express from 'express';
import * as authController from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.post('/change-password', authMiddleware, authController.changePassword);

// Email verification
router.post('/verify-email', authMiddleware, authController.verifyEmail);
router.post('/confirm-email', authController.confirmEmailVerification);

export default router;
