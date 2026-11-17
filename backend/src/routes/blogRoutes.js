/**
 * Blog Routes
 * API endpoints for blog CRUD operations
 */

import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getBlogStats,
} from '../controllers/blogController.js';
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
    // Only allow image files
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
 * GET all blog posts
 * Query parameters: status, category, sort, page, limit
 */
router.get('/', getAllPosts);

/**
 * GET blog statistics
 */
router.get('/stats', getBlogStats);

/**
 * GET single blog post by ID or slug
 */
router.get('/:id', getPostById);

/**
 * CREATE new blog post (admin only)
 * Expected: multipart/form-data
 */
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), createPost);

/**
 * UPDATE blog post (admin only)
 */
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), updatePost);

/**
 * DELETE blog post (admin only)
 */
router.delete('/:id', authMiddleware, adminMiddleware, deletePost);

export default router;
