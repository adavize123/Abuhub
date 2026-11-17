/**
 * Main Server File
 * ABUHUB Backend API Server
 * Initializes Express server, database connection, and API routes
 */

import express from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import { corsMiddleware } from './middleware/corsHandler.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import projectRoutes from './routes/projectRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE
// ============================================

// Enable JSON parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Enable CORS
app.use(corsMiddleware);

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// ============================================
// ROUTES
// ============================================

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ABUHUB API is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * API Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/projects', projectRoutes);

/**
 * Root endpoint - API information
 */
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ABUHUB API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      blog: '/api/blog',
      contact: '/api/contact',
      services: '/api/services',
      testimonials: '/api/testimonials',
      projects: '/api/projects',
      health: '/health',
    },
  });
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Error handler - must be last
app.use(errorHandler);

// ============================================
// DATABASE & SERVER STARTUP
// ============================================

/**
 * Start the server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`\n${'='.repeat(50)}`);
      console.log(`✓ ABUHUB API Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✓ Base URL: http://localhost:${PORT}`);
      console.log(`${'='.repeat(50)}\n`);
    });
  } catch (error) {
    console.error(`✗ Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

process.on('SIGTERM', () => {
  console.log('\n⚠ SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n⚠ SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();

export default app;
