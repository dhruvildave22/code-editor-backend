'use strict';

const BaseClientError = require('./base-client-error');

/**
 * Represents HTTP 409 errors. This response indicates that the request conflicts
 * with the current state of the server.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409
 */
class ConflictError extends BaseClientError {
  constructor(message = 'Conflict', errorCode) {
    super(message, 409, undefined, errorCode);

    this.name = 'ConflictError';
    this.code = 'CONFLICT_ERROR';
  }
}

module.exports = ConflictError;
