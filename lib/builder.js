/*
 * http-request-builder
 * Copyright(c) 2014 AlexanderMac <amatsibarov@gmail.com>
 * MIT Licensed
 */

var _ = require('lodash');
var url = require('url');
var httpConsts = require('../resources/http-consts');

var CRLF = '\n';

function HttpRequestBuilder() {}

HttpRequestBuilder.prototype.build = function (requestObj) {
	var httpRequest =
		requestObj.method + ' ' +
		requestObj.protocol.toLowerCase() + '://' +
		requestObj.url + ' ' +
		requestObj.protocolVersion + CRLF;
  // TODO: add check for www
	httpRequest += 'HOST: ' + url.parse('www://' + requestObj.url).host + CRLF; 

	httpRequest += generateHeaders(requestObj.headers);
	httpRequest += generateCookie(requestObj.cookie);
	httpRequest += generateBody(requestObj.body);

	return httpRequest;
};

function generateHeaders(headers) {
	var ret = '';
	_.each(headers, function (header) {
		ret += header.name + ': ';
		_.each(header.values, function (headerValue, index) {
			ret += headerValue.value;
			if (headerValue.params) {
				ret += ';' + headerValue.params;
			}
			if (index < header.values.length - 1) {
				ret += ', ';
			}
		});
		ret += CRLF;
	});
	
	return ret;
}

function generateCookie(cookie) {
	var ret = '';
  
	if (cookie && cookie.length) {
		ret += 'Cookie: ';
		_.each(cookie, function (cook, index) {
			ret += cook.name + '=' + cook.value;
			if (index < cookie.length - 1) {
				ret += '; ';
			}
		});
		ret += CRLF;
	}
	ret += CRLF;
	
	return ret;
}

function generateBody(body) {
	var ret = '';
	if (!body) {
		return ret;
	}

	switch (body.contentType) {
		case httpConsts.contentTypes.formData:
			_.each(body.formDataParams, function (dataParam) {
				ret += '-----------------------' + body.boundary;
				ret += CRLF;
				ret += 'Content-Disposition: form-data; name="' + dataParam.name + '"';
				ret += CRLF;
				ret += CRLF;
				ret += dataParam.value;
				ret += CRLF;
			});
			if (body.formDataParams.length > 0) {
				ret += '-----------------------' + body.boundary + '--';
			}
			break;

		case httpConsts.contentTypes.xWwwFormUrlencoded:
			_.each(body.formDataParams, function (dataParam, index) {
				ret += dataParam.name + '=' + dataParam.value;
				if (index < body.formDataParams.length - 1) {
					ret += '&';
				}
			});
			break;

		default:
			ret = body.plain;
			break;
	}

	return ret;
}

var hrb = new HttpRequestBuilder();
hrb.HttpRequestBuilder = HttpRequestBuilder;

module.exports = hrb;
