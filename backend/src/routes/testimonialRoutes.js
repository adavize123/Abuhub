/**
 * Testimonial Routes
 */

import express from 'express';
import * as testimonialController from '../controllers/testimonialController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
import { testimonialSubmissionRateLimit, requireCaptchaForTestimonial } from '../middleware/testimonialSecurity.js';

const router = express.Router();

// Public
router.get('/', testimonialController.getAllTestimonials);
// Email action endpoint (signed token links)
router.get('/action', testimonialController.handleAction);
router.get('/:id', testimonialController.getTestimonialById);

// Protected admin actions
// Public submissions: allowed but default to unpublished (isPublished=false)
router.post('/', testimonialSubmissionRateLimit, requireCaptchaForTestimonial, testimonialController.createTestimonial);

router.put('/:id', authMiddleware, adminMiddleware, testimonialController.updateTestimonial);
router.delete('/:id', authMiddleware, adminMiddleware, testimonialController.deleteTestimonial);
// Admin routes
router.get('/admin/all', authMiddleware, adminMiddleware, testimonialController.getAllTestimonialsAdmin);

export default router;
