/**
 * Contact Routes
 * API endpoints for contact form submissions
 */

import express from 'express';
import {
  submitContact,
  getAllContacts,
  getContactById,
  markAsReplied,
  deleteContact,
} from '../controllers/contactController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * POST submit contact form (public — visitors must be able to reach this)
 */
router.post('/', submitContact);

/**
 * GET all contact messages (admin only — contains visitor PII)
 */
router.get('/', authMiddleware, adminMiddleware, getAllContacts);

/**
 * GET single contact message (admin only)
 */
router.get('/:id', authMiddleware, adminMiddleware, getContactById);

/**
 * PATCH mark contact as replied (admin only)
 */
router.patch('/:id/replied', authMiddleware, adminMiddleware, markAsReplied);

/**
 * DELETE contact message (admin only)
 */
router.delete('/:id', authMiddleware, adminMiddleware, deleteContact);

export default router;
