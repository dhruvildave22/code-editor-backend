'use strict';

const BaseClientError = require('./base-client-error');

/**
 * Represents HTTP 404 errors. This response indicates that the server can't find
 * the requested resource.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
 */
class NotFoundError extends BaseClientError {
  constructor(message = 'Not Found', errorCode) {
    super(message, 404, undefined, errorCode);

    this.name = 'NotFoundError';
    this.code = 'NOT_FOUND_ERROR';
  }
}

module.exports = NotFoundError;
