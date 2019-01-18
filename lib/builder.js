'use strict';

const _                   = require('lodash');
const os                  = require('os');
const httpConst           = require('http-const');
const InvalidRequestError = require('./invalid-request-error');

let httpRequestBuilder = {
  build: (requestObj) => {
    if (!requestObj) {
      throw new InvalidRequestError('requestObj must be not undefined');
    }

    return '' +
      _generateStartLine(requestObj.method, requestObj.protocol, requestObj.url, requestObj.protocolVersion) +
      _generateHostLine(requestObj.url) +
      _generateHeaders(requestObj.headers) +
      _generateCookie(requestObj.cookie) +
      _generateBody(requestObj.body);
  }
};

function _generateStartLine(method, protocol, url, protocolVersion) {
  if (!method || !protocol || !url || !protocolVersion) {
    throw new InvalidRequestError('Method, url, protocol and protocolVersion must be defined');
  }
  let newUrl = _.trimStart(url, '/');
  return `${method} ${protocol.toLowerCase()}://${newUrl} ${protocolVersion}\n`;
}

function _generateHostLine(url) {
  let host = _getHostName(url);
  return `HOST: ${host}\n`;
}

function _generateHeaders(headers) {
  if (!headers || !_.isArray(headers) || !headers.length) {
    throw new InvalidRequestError('Headers list must be defined');
  }

  let headerLines = _.map(headers, (header) => {
    if (!header.name) {
      throw new InvalidRequestError('Header name must be defined', JSON.stringify(header));
    }

    if (!header.values || !_.isArray(header.values) || !header.values.length) {
      throw new InvalidRequestError('Header values list must be defined', JSON.stringify(header));
    }

    let hvs = _.map(header.values, (headerValue) => {
      let hv = headerValue.value;
      if (!hv) {
        throw new InvalidRequestError('Header value must be defined', JSON.stringify(header));
      }

      if (headerValue.params) {
        hv += ';' + headerValue.params;
      }
      return hv;
    });

    return header.name + ': ' + hvs.join(', ');
  });

  return headerLines.join(os.EOL) + os.EOL;
}

function _generateCookie(cookie) {
  if (!cookie) {
    return '';
  }

  if (!_.isArray(cookie) || !cookie.length) {
    throw new InvalidRequestError('Cookie name-value pairs list must be defined');
  }

  let nameValuePairs = _.map(cookie, (nameValuePair) => {
    if (!nameValuePair.name || !nameValuePair.value) {
      throw new InvalidRequestError('Cookie name or value must be defined', JSON.stringify(nameValuePair));
    }

    return nameValuePair.name + '=' + nameValuePair.value;
  });

  return 'Cookie: ' + nameValuePairs.join('; ') + os.EOL;
}

function _generateBody(body) {
  if (!body) {
    return os.EOL;
  }

  let formDataParams;
  switch (body.contentType) {
    case httpConst.contentTypes.formData:
      if (!body.boundary) {
        throw new InvalidRequestError(
          'Body with ContentType=multipart/form-data must have boundary in ContentType header');
      }

      if (!body.formDataParams || !_.isArray(body.formDataParams) || !body.formDataParams.length) {
        throw new InvalidRequestError('Body with ContentType=multipart/form-data must have parameters');
      }

      formDataParams = _.map(body.formDataParams, (dataParam) => {
        if (!dataParam.name || !dataParam.value) {
          throw new InvalidRequestError('FormData parameter must have name and value', JSON.stringify(dataParam));
        }
        return [
          '-----------------------' + body.boundary,
          os.EOL,
          `Content-Disposition: form-data; name="${dataParam.name}"`,
          os.EOL,
          os.EOL,
          dataParam.value,
          os.EOL
        ].join('');
      }).join('');

      return `\n${formDataParams}-----------------------${body.boundary}--`;

    case httpConst.contentTypes.xWwwFormUrlencoded:
      if (!body.formDataParams || !_.isArray(body.formDataParams) || !body.formDataParams.length) {
        throw new InvalidRequestError('Body with ContentType=application/x-www-form-urlencoded must have parameters');
      }

      formDataParams = _.map(body.formDataParams, (dataParam) => {
        if (!dataParam.name || !dataParam.value) {
          throw new InvalidRequestError('FormData parameter must have name and value', JSON.stringify(dataParam));
        }
        return dataParam.name + '=' + dataParam.value;
      }).join('&');

      return `\n${formDataParams}`;

    case httpConst.contentTypes.json:
      return '\n' + body.json;

    default:
      return `\n${body.plain}`;
  }
}

function _getHostName(url) {
  let match = url.match(/(www[0-9]?\.)?(.[^/]+)/i);
  if (match && match.length > 2) {
    return _.trimStart(match[2], '/');
  }
}

module.exports = httpRequestBuilder;
