'use strict';

const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  ServerError,
} = require('../errors');

/**
 * Utility functions for throwing consistent errors
 */
class ErrorUtils {
  static throwBadRequest(message, errorCode) {
    throw new BadRequestError(message, errorCode);
  }

  static throwUnauthorized(message, errorCode) {
    throw new UnauthorizedError(message, errorCode);
  }

  static throwForbidden(message, errorCode) {
    throw new ForbiddenError(message, errorCode);
  }

  static throwNotFound(message, errorCode) {
    throw new NotFoundError(message, errorCode);
  }

  static throwConflict(message, errorCode) {
    throw new ConflictError(message, errorCode);
  }

  static throwValidation(message, errorCode, details) {
    throw new ValidationError(message, errorCode, details);
  }

  static throwServer(message, statusCode, errorCode) {
    throw new ServerError(message, statusCode, errorCode);
  }

  /**
   * Common error scenarios for this application
   */
  static userNotFound() {
    throw new NotFoundError('User not found', 'USER_NOT_FOUND');
  }

  static userAlreadyExists() {
    throw new ConflictError(
      'User with this email already exists',
      'USER_ALREADY_EXISTS'
    );
  }

  static invalidCredentials() {
    throw new UnauthorizedError('Invalid credentials', 'INVALID_CREDENTIALS');
  }

  static accessDenied() {
    throw new ForbiddenError('Access denied', 'ACCESS_DENIED');
  }

  static invalidToken() {
    throw new UnauthorizedError('Invalid or expired token', 'INVALID_TOKEN');
  }

  static invalidUserType() {
    throw new BadRequestError('Invalid user type', 'INVALID_USER_TYPE');
  }

  static emailAlreadyExists() {
    throw new ConflictError('Email already registered', 'EMAIL_ALREADY_EXISTS');
  }
}

module.exports = ErrorUtils;
