http-request-builder
====================

A node package for building a plain http request from an object.

## Features
* Building headers (with parameters).
* Building cookies.
* Building body with contentType:
  * multipart/form-data
  * application/x-www-form-urlencoded
  * text/plain'

## Usage

```javascript
var builder = require('http-request-builder');

var requestObj = { 
  method: 'GET',
  protocol: 'HTTP',
  url: 'localhost/test',
  protocolVersion: 'HTTP/2.1',
  host: 'localhost',
  headers: [ 
    { name: 'Connection', values: [ { value: 'keep-alive', params: null } ] },          
    { name: 'Cache-Control', values: [ { value: 'no-cache', params: null } ] },
    { name: 'User-Agent', values: [ { value: 'Mozilla/5.0 (Windows NT 6.1 WOW64)', params: null } ]},
    { name: 'Accept', values: [ { value: '*/*', params: null } ] },
    { name: 'Accept-Encoding', values: [ 
      { value: 'gzip', params: null },
      { value: 'deflate', params: null }
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

var request = builder.build(requestObj);

// request now is a string:
/*
GET http://localhost/test HTTP/2.1
HOST: localhost/test
Connection: keep-alive   
Cache-Control: no-cache
User-Agent: Mozilla/5.0 (Windows NT 6.1 WOW64)
Accept: /
Accept-Encoding: gzip, deflate
Accept-Language: en-US;q=0.6, en;q=0.4
Cookie: csrftoken=123abc; sessionid=456def


*/
```

This package builds a plain model from an object, which generates another [package](https://github.com/AlexanderMac/http-request-parser) (parse a plain http request, and creating an object model for it).

## License
This code available under the MIT License.
See License.md for details.  

## Authors

**Alexander Mac** ([amatsibarov@gmail.com](mailto:amatsibarov@gmail.com))
