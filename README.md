http-request-builder
====================

# WARNING: this repo is not maintained anymore, use [http-z](https://github.com/AlexanderMac/http-z) instead.

Build HTTP request message from an object model. Can be used on server and client sides. To parse request message and create an object model for it, use [http-request-parser](https://github.com/AlexanderMac/http-request-parser).

[![Build Status](https://travis-ci.org/AlexanderMac/http-request-builder.svg?branch=master)](https://travis-ci.org/AlexanderMac/http-request-builder)
[![Code Coverage](https://codecov.io/gh/AlexanderMac/http-request-builder/branch/master/graph/badge.svg)](https://codecov.io/gh/AlexanderMac/http-request-builder)
[![npm version](https://badge.fury.io/js/http-request-builder.svg)](https://badge.fury.io/js/http-request-builder)

## Features
* Build HTTP request message:
  - headers (with parameters)
  - cookies
  - body (with supported contentTypes: `multipart/form-data`, `application/x-www-form-urlencoded`, `text/plain`)

## Installation

```sh
$ npm i -S http-request-builder
```

## Usage

```js
const builder = require('http-request-builder');

let requestObj = { 
  method: 'GET',
  protocol: 'HTTP',
  url: 'example.com/features?p1=v1',
  protocolVersion: 'HTTP/1.1',
  host: 'example.com',
  headers: [ 
    { name: 'Connection', values: [ { value: 'keep-alive' } ] },
    { name: 'Cache-Control', values: [ { value: 'no-cache' } ] },
    { name: 'User-Agent', values: [ { value: 'Mozilla/5.0 (Windows NT 6.1 WOW64)' } ]},
    { name: 'Accept', values: [ { value: '*/*' } ] },
    { name: 'Accept-Encoding', values: [ 
      { value: 'gzip' },
      { value: 'deflate' }
    ]},
    { name: 'Accept-Language', values: [
      { value: 'en-US', params: 'q=0.6' },
      { value: 'en', params: 'q=0.4' } 
    ]}
  ],
  cookie: [
    { name: 'csrftoken', value: '123abc' },
    { name: 'sessionid', value: '456def' }
  ]
};

let requestMsg = builder.build(requestObj);
console.log(requestMsg);

/* prints:
GET http://example.com/features?p1=v1 HTTP/1.1
Host: example.com
Connection: keep-alive
Cache-Control: no-cache
User-Agent: Mozilla/5.0 (Windows NT 6.1 WOW64)
Accept: /
Accept-Encoding: gzip, deflate
Accept-Language: en-US;q=0.6, en;q=0.4
Cookie: csrftoken=123abc; sessionid=456def


*/
```

## Author
Alexander Mac

## License
Licensed under the MIT license.
