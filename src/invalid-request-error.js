'use strict';

function InvalidRequestError(message, data) {
  if (message) {
    this.message = data ?
      `Invalid request object. ${message}. Data: ${data}` :
      `Invalid request object. ${message}`;
  } else {
    this.message = 'Invalid request object';
  }
}

module.exports = InvalidRequestError;
