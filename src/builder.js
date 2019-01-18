'use strict';

const _                   = require('lodash');
const os                  = require('os');
const httpConst           = require('http-const');
const InvalidRequestError = require('./invalid-request-error');

class HttpRequestBuilder {
  static build(params) {
    let instance = new HttpRequestBuilder(params);
    return instance.build();
  }

  constructor(requestObj) {
    this.requestObj = requestObj;
  }

  build() {
    if (!this.requestObj) {
      throw new InvalidRequestError('requestObj must be not undefined');
    }
    this.method = this.requestObj.method;
    this.url = this.requestObj.url;
    this.protocol = this.requestObj.protocol;
    this.protocolVersion = this.requestObj.protocolVersion;
    this.headers = this.requestObj.headers;
    this.cookie = this.requestObj.cookie;
    this.body = this.requestObj.body;

    return '' +
      this._generateStartLine() +
      this._generateHostLine() +
      this._generateHeaders() +
      this._generateCookie() +
      this._generateBody();
  }

  _generateStartLine() {
    if (!this.method) {
      throw new InvalidRequestError('Method must be defined');
    }
    if (!this.url) {
      throw new InvalidRequestError('Url must be defined');
    }
    if (!this.protocol) {
      throw new InvalidRequestError('Protocol must be defined');
    }
    if (!this.protocolVersion) {
      throw new InvalidRequestError('ProtocolVersion must be defined');
    }
    let newUrl = _.trimStart(this.url, '/');
    return `${this.method} ${this.protocol.toLowerCase()}://${newUrl} ${this.protocolVersion}\n`;
  }

  _generateHostLine() {
    let host = this._getHostName();
    return `HOST: ${host}\n`;
  }

  _generateHeaders() {
    if (!this.headers || !_.isArray(this.headers) || !this.headers.length) {
      throw new InvalidRequestError('Headers list must be defined');
    }

    let headerLines = _.map(this.headers, (header) => {
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

  _generateCookie() {
    if (!this.cookie) {
      return '';
    }

    if (!_.isArray(this.cookie) || !this.cookie.length) {
      throw new InvalidRequestError('Cookie name-value pairs list must be defined');
    }

    let nameValuePairs = _.map(this.cookie, (nameValuePair) => {
      if (!nameValuePair.name || !nameValuePair.value) {
        throw new InvalidRequestError('Cookie name or value must be defined', JSON.stringify(nameValuePair));
      }

      return nameValuePair.name + '=' + nameValuePair.value;
    });

    return 'Cookie: ' + nameValuePairs.join('; ') + os.EOL;
  }

  _generateBody() {
    if (!this.body) {
      return os.EOL;
    }

    let formDataParams;
    switch (this.body.contentType) {
      case httpConst.contentTypes.formData:
        if (!this.body.boundary) {
          throw new InvalidRequestError(
            'Body with ContentType=multipart/form-data must have boundary in ContentType header');
        }

        if (!this.body.formDataParams || !_.isArray(this.body.formDataParams) || !this.body.formDataParams.length) {
          throw new InvalidRequestError('Body with ContentType=multipart/form-data must have parameters');
        }

        formDataParams = _.map(this.body.formDataParams, (dataParam) => {
          if (!dataParam.name || !dataParam.value) {
            throw new InvalidRequestError('FormData parameter must have name and value', JSON.stringify(dataParam));
          }
          return [
            '-----------------------' + this.body.boundary,
            os.EOL,
            `Content-Disposition: form-data; name="${dataParam.name}"`,
            os.EOL,
            os.EOL,
            dataParam.value,
            os.EOL
          ].join('');
        }).join('');

        return `\n${formDataParams}-----------------------${this.body.boundary}--`;

      case httpConst.contentTypes.xWwwFormUrlencoded:
        if (!this.body.formDataParams || !_.isArray(this.body.formDataParams) || !this.body.formDataParams.length) {
          throw new InvalidRequestError('Body with ContentType=application/x-www-form-urlencoded must have parameters');
        }

        formDataParams = _.map(this.body.formDataParams, (dataParam) => {
          if (!dataParam.name || !dataParam.value) {
            throw new InvalidRequestError('FormData parameter must have name and value', JSON.stringify(dataParam));
          }
          return dataParam.name + '=' + dataParam.value;
        }).join('&');

        return `\n${formDataParams}`;

      case httpConst.contentTypes.json:
        return '\n' + this.body.json;

      default:
        return `\n${this.body.plain}`;
    }
  }

  _getHostName() {
    let match = this.url.match(/(www[0-9]?\.)?(.[^/]+)/i);
    if (match && match.length > 2) {
      return _.trimStart(match[2], '/');
    }
  }
}

module.exports = HttpRequestBuilder;
