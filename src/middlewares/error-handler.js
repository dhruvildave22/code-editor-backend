'use strict';

const { BaseClientError, ServerError } = require('../errors');

/**
 * Global error handler middleware
 */
const errorHandler = (error, req, res, next) => {
  console.error('Error occurred:', error);

  // Handle custom client errors (4xx)
  if (error instanceof BaseClientError) {
    return res.status(error.statusCode).json({
      error: error.message,
      code: error.code,
      ...(error.errorCode && { errorCode: error.errorCode }),
      ...(error.details && { details: error.details })
    });
  }

  // Handle custom server errors (5xx)
  if (error instanceof ServerError) {
    return res.status(error.statusCode).json({
      error: error.message,
      code: error.code,
      ...(error.errorCode && { errorCode: error.errorCode })
    });
  }

  // Handle validation errors from Zod (already handled in validation middleware)
  if (error.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.issues || []
    });
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
      code: 'INVALID_TOKEN'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired',
      code: 'TOKEN_EXPIRED'
    });
  }

  // Handle database errors
  if (error.code === '23505') { // PostgreSQL unique violation
    return res.status(409).json({
      error: 'Resource already exists',
      code: 'DUPLICATE_ENTRY'
    });
  }

  if (error.code === '23503') { // PostgreSQL foreign key violation
    return res.status(400).json({
      error: 'Referenced resource does not exist',
      code: 'FOREIGN_KEY_VIOLATION'
    });
  }

  // Default server error
  console.error('Unhandled error:', error);
  return res.status(500).json({
    error: 'Internal server error',
    code: 'INTERNAL_SERVER_ERROR'
  });
};

module.exports = errorHandler;
