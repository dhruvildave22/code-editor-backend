'use strict';

/**
 * Represents HTTP 5xx server errors. These errors indicate that the server
 * encountered an unexpected condition that prevented it from fulfilling the request.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#server_error_responses
 */
class ServerError extends Error {
  constructor(message = 'Internal Server Error', statusCode = 500, errorCode) {
    super(message);

    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.name = 'ServerError';
    this.code = 'SERVER_ERROR';

    if (this.statusCode < 500 || this.statusCode > 599) {
      throw new Error(
        `Illegal Argument: statusCode must be 5xx, but received ${statusCode}`
      );
    }
  }
}

module.exports = ServerError;
