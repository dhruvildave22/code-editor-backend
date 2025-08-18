'use strict';

// Base Errors
const BaseClientError = require('./base-client-error');
const ServerError = require('./server-error');

// Client Errors (4xx)
const BadRequestError = require('./bad-request-error');
const UnauthorizedError = require('./unauthorized-error');
const ForbiddenError = require('./forbidden-error');
const NotFoundError = require('./not-found-error');
const ConflictError = require('./conflict-error');
const ValidationError = require('./validation-error');

module.exports = {
  // Base Classes
  BaseClientError,
  ServerError,

  // Client Errors
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
};
