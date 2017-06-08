/*
 * http-request-builder
 * Copyright(c) 2014-2015 AlexanderMac <amatsibarov@gmail.com>
 * MIT Licensed
 */

var sprintf = require('sprintf-js').sprintf;

function InvalidRequestError(message, data) {
  if (message) {
    this.message = data ? 
    sprintf('Invalid request object. %s. Data: %s', message, data) :
    sprintf('Invalid request object. %s', message);
  } else {
    this.message = 'Invalid request object.'; 
  }
}

module.exports = InvalidRequestError;