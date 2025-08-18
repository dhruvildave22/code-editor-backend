'use strict';

/**
 * Abstract class representing HTTP 4xx errors, where the error message (but not the stack) will be
 * displayed to the client. This shouldn't be instantiated directly; instead, subclass this for
 * specific 4xx errors (i.e. BadRequestError for 400 error).
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#client_error_responses
 * @abstract
 */
class BaseClientError extends Error {
  /** {number} HTTP status code */
  statusCode;

  /**
   * @param {string} message Error message that will be returned to client.
   * @param {number} statusCode HTTP status code. Must be in 4xx range.
   * @param {string} [contentType] Content type of the response. Defaults to 'application/json'.
   * @param {string} [errorCode] Optional error code to include in the response. If provided, the
   *   response will be in JSON format with an 'error' field containing the message and an 'errorCode'
   *   field containing the error code.
   */
  constructor(message, statusCode, contentType, errorCode) {
    super(message);
    
    if (this.constructor === BaseClientError) {
      throw new TypeError('Direct instantiation of abstract class not allowed.');
    }

    this.statusCode = parseInt(statusCode, 10);
    if (this.statusCode < 400 || this.statusCode > 499) {
      throw new Error(`Illegal Argument: statusCode must be 4xx, but received ${statusCode}`);
    }

    this.contentType = contentType ?? 'application/json';
    this.errorCode = errorCode;
    this.name = 'BaseClientError';
    this.code = 'BASE_CLIENT_ERROR';
  }
}

module.exports = BaseClientError;
