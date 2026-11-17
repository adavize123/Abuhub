/**
 * Error Handling Middleware
 * Centralized error handling for the entire application
 */

/**
 * General error handler middleware
 * All errors should be passed to this middleware
 */
export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[${new Date().toISOString()}] Error: ${message}`);
  console.error(err);

  res.status(status).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { error: err.stack }),
  });
};

/**
 * 404 Not Found middleware
 * Handles requests to undefined routes
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route '${req.originalUrl}' not found`,
  });
};

export default { errorHandler, notFoundHandler };
