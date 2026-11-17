/**
 * Project Routes
 * API endpoints for the projects portfolio
 */

import express from 'express';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * GET all projects (public — defaults to published only)
 */
router.get('/', getAllProjects);

/**
 * GET single project by ID or slug (public)
 */
router.get('/:id', getProjectById);

/**
 * CREATE new project (admin only)
 */
router.post('/', authMiddleware, adminMiddleware, createProject);

/**
 * UPDATE project (admin only)
 */
router.put('/:id', authMiddleware, adminMiddleware, updateProject);

/**
 * DELETE project (admin only)
 */
router.delete('/:id', authMiddleware, adminMiddleware, deleteProject);

export default router;
