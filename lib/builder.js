/*
 * http-request-builder
 * Copyright(c) 2014 AlexanderMac <amatsibarov@gmail.com>
 * MIT Licensed
 */

var _ = require('lodash');
var _s = require('underscore.string');
var httpConsts = require('./http-consts');
var InvalidRequestError = require('./invalid-request-error');

var CRLF = '\n';

function HttpRequestBuilder() {}

HttpRequestBuilder.prototype.build = function (requestObj) {
  if (!requestObj) {
    throw new InvalidRequestError('requestObj must be not null');
  }
  
  return '' +
    generateStartLine(requestObj.method, requestObj.protocol, requestObj.url, requestObj.protocolVersion) +
    generateHostLine(requestObj.url) +
    generateHeaders(requestObj.headers) +
    generateCookie(requestObj.cookie) +
    generateBody(requestObj.body);
};

function generateStartLine(method, protocol, url, protocolVersion) {
  if (!method || !protocol || !url || !protocolVersion) {
    throw new InvalidRequestError('Method, url, protocol and protocolVersion must be not empty');
  }
  var newUrl = _s.ltrim(url, '/');
  return _s.sprintf('%s %s://%s %s\n', method, protocol.toLowerCase(), newUrl, protocolVersion);
}

function generateHostLine(url) {
  var host = getHostName(url);
  if (!host) {
    throw new InvalidRequestError('Host is undefined, requestUrl has invalid format');
  }  
  return _s.sprintf('HOST: %s\n', host); 
}

function generateHeaders(headers) {
  if (!headers || !_.isArray(headers) || !headers.length) {
    throw new InvalidRequestError('Headers list must be not empty');
  }
  
  var headerLines = _.map(headers, function (header) {
    if (!header.name) {
      throw new InvalidRequestError('Header name must be not empty', header);
    }
    
    if (!header.values || !_.isArray(header.values) || !header.values.length) {
      throw new InvalidRequestError('Header values list must be not empty', header);
    }
    
    var hvs = _.map(header.values, function (headerValue) {
      var hv = headerValue.value;
      if (!hv) {
        throw new InvalidRequestError('Header value must be not empty', header);
      }
      
      if (headerValue.params) {
        hv += ';' + headerValue.params;
      }
      return hv;
    });
    
    return header.name + ': ' + hvs.join(', ');
  });
  
  return headerLines.join(CRLF) + CRLF;
}

function generateCookie(cookie) {
  if (!cookie) {
    return '';
  }
  
  if (!_.isArray(cookie) || !cookie.length) {
    throw new InvalidRequestError('Cookie name-value pairs list must be not empty');
  }
  
  var nameValuePairs = _.map(cookie, function (nameValuePair) {
    if (!nameValuePair.name || !nameValuePair.value) {
      throw new InvalidRequestError('Cookie name or value must be not empty', nameValuePair);
    }
    
    return nameValuePair.name + '=' + nameValuePair.value;
  });
  
  return 'Cookie: ' + nameValuePairs.join('; ') + CRLF;
}

function generateBody(body) {
  if (!body) {
    return CRLF;
  }

  var formDataParams;
  switch (body.contentType) {
    case httpConsts.contentTypes.formData:
      if (!body.boundary) {
        throw new InvalidRequestError('Body with ContentType=multipart/form-data must have boundary in ContentType header');
      }
      
      if (!body.formDataParams || !_.isArray(body.formDataParams) || !body.formDataParams.length) {
        throw new InvalidRequestError('Body with ContentType=multipart/form-data must have parameters');
      }
      
      formDataParams = _.map(body.formDataParams, function (dataParam) {
        if (!dataParam.name || !dataParam.value) {
          throw new InvalidRequestError('FormData parameter must have name and value', dataParam);
        }        
        return [
          '-----------------------' + body.boundary,
          CRLF,
          _s.sprintf('Content-Disposition: form-data; name="%s"', dataParam.name),
          CRLF,
          CRLF,
          dataParam.value,
          CRLF
        ].join('');
      }).join('');
      
      return _s.sprintf('\n%s-----------------------%s--', formDataParams, body.boundary);

    case httpConsts.contentTypes.xWwwFormUrlencoded:
      if (!body.formDataParams || !_.isArray(body.formDataParams) || !body.formDataParams.length) {
        throw new InvalidRequestError('Body with ContentType=application/x-www-form-urlencoded must have parameters');
      }
      
      formDataParams = _.map(body.formDataParams, function (dataParam) {
        if (!dataParam.name || !dataParam.value) {
          throw new InvalidRequestError('FormData parameter must have name and value', dataParam);
        }
        return dataParam.name + '=' + dataParam.value;
      }).join('&');
      
      return _s.sprintf('\n%s', formDataParams);

    default:
      return _s.sprintf('\n%s', body.plain);
  }
}

function getHostName(url) {
  if (!url) {
    return;
  }
  
  var match = url.match(/(www[0-9]?\.)?(.[^/]+)/i);
  if (match && match.length > 2 && typeof match[2] === 'string' 
      && match[2].length > 0) {
        return _s.ltrim(match[2], '/');
  }
  return;
}

var hrb = new HttpRequestBuilder();
hrb.HttpRequestBuilder = HttpRequestBuilder;

module.exports = hrb;
