/**
 * Service Routes
 * API endpoints for service management
 */

import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

/**
 * GET all services
 */
router.get('/', getAllServices);

/**
 * GET single service
 */
router.get('/:id', getServiceById);

/**
 * CREATE new service (admin only)
 */
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), createService);

/**
 * UPDATE service (admin only)
 */
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), updateService);

/**
 * DELETE service (admin only)
 */
router.delete('/:id', authMiddleware, adminMiddleware, deleteService);

export default router;
