'use strict';

const BaseClientError = require('./base-client-error');

/**
 * Represents HTTP 400 errors. This response is appropriate when the client has made an
 * invalid request.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
 */
class BadRequestError extends BaseClientError {
  constructor(message = 'Bad Request', errorCode) {
    super(message, 400, undefined, errorCode);

    this.name = 'BadRequestError';
    this.code = 'BAD_REQUEST_ERROR';
  }
}

module.exports = BadRequestError;
