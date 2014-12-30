http-request-builder
====================

A node package for building HTTP request message from an object model. Can be used on server and client sides.

## Features
* Building headers (with parameters).
* Building cookies.
* Building body with contentType:
  * multipart/form-data
  * application/x-www-form-urlencoded
  * text/plain

## Usage

```javascript
var builder = require('http-request-builder');

var requestObj = { 
  method: 'GET',
  protocol: 'HTTP',
  url: 'app.com/features?p1=v1',
  protocolVersion: 'HTTP/1.1',
  host: 'app.com',
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

var request = builder.build(requestObj);

// request now is a string:
/*
GET http://app.com/features?p1=v1 HTTP/1.1
Host: app.com
Connection: keep-alive   
Cache-Control: no-cache
User-Agent: Mozilla/5.0 (Windows NT 6.1 WOW64)
Accept: /
Accept-Encoding: gzip, deflate
Accept-Language: en-US;q=0.6, en;q=0.4
Cookie: csrftoken=123abc; sessionid=456def


*/
```

This package builds HTTP request message from an object model, which generates another [package](https://github.com/AlexanderMac/http-request-parser) (parses HTTP request message, and creates an object model for it).

## License
This code available under the MIT License.
See License.md for details.  

## Authors

**Alexander Mac** ([amatsibarov@gmail.com](mailto:amatsibarov@gmail.com))
