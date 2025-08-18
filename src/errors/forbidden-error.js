'use strict';

const BaseClientError = require('./base-client-error');

/**
 * Represents HTTP 403 errors. This response indicates that the server understood the request
 * but refuses to authorize it.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403
 */
class ForbiddenError extends BaseClientError {
  constructor(message = 'Forbidden', errorCode) {
    super(message, 403, undefined, errorCode);

    this.name = 'ForbiddenError';
    this.code = 'FORBIDDEN_ERROR';
  }
}

module.exports = ForbiddenError;
