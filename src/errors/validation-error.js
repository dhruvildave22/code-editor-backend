'use strict';

const BaseClientError = require('./base-client-error');

/**
 * Represents HTTP 422 errors. This response indicates that the server understands
 * the content type of the request entity but was unable to process the contained instructions.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422
 */
class ValidationError extends BaseClientError {
  constructor(message = 'Validation Failed', errorCode, details = null) {
    super(message, 422, undefined, errorCode);

    this.name = 'ValidationError';
    this.code = 'VALIDATION_ERROR';
    this.details = details;
  }
}

module.exports = ValidationError;
