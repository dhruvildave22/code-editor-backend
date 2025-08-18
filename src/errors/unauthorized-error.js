'use strict';

const BaseClientError = require('./base-client-error');

/**
 * Represents HTTP 401 errors. This response indicates that the request has not been applied
 * because it lacks valid authentication credentials.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401
 */
class UnauthorizedError extends BaseClientError {
  constructor(message = 'Unauthorized', errorCode) {
    super(message, 401, undefined, errorCode);

    this.name = 'UnauthorizedError';
    this.code = 'UNAUTHORIZED_ERROR';
  }
}

module.exports = UnauthorizedError;
