/*
 * http-request-builder
 * Copyright(c) 2014 AlexanderMac <amatsibarov@gmail.com>
 * MIT Licensed
 */

var builder = require('../index');
var should = require('should');

describe('#build()', function() {
  
  describe('GET method', function() {
    it('should build plain request from valid object (with cookie)', function() {
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
        ],
        body: null
      };
      
      var expected = [
        'GET http://localhost/test HTTP/2.1',
        'HOST: localhost',
        'Connection: keep-alive',      
        'Cache-Control: no-cache',
        'User-Agent: Mozilla/5.0 (Windows NT 6.1 WOW64)',
        'Accept: */*',
        'Accept-Encoding: gzip, deflate',
        'Accept-Language: en-US;q=0.6, en;q=0.4',
        'Cookie: csrftoken=123abc; sessionid=456def',
        '',
        ''
      ].join('\n');
      
      var actual = builder.build(requestObj);
      actual.should.eql(expected);      
    });
    
    it('should build plain request from valid object (without cookie)', function() {
      var requestObj = { 
        method: 'GET',
        protocol: 'HTTPS',
        url: 'localhost/test',
        protocolVersion: 'HTTP/1.1',
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
        cookie: null,
        body: null
      };
      
      var expected = [
        'GET https://localhost/test HTTP/1.1',
        'HOST: localhost',
        'Connection: keep-alive',      
        'Cache-Control: no-cache',
        'User-Agent: Mozilla/5.0 (Windows NT 6.1 WOW64)',
        'Accept: */*',
        'Accept-Encoding: gzip, deflate',
        'Accept-Language: en-US;q=0.6, en;q=0.4',
        '',
        ''
      ].join('\n');
      
      var actual = builder.build(requestObj);
      actual.should.eql(expected);      
    });
    
    it('should build plain request from valid object (with body ,contentType=application/x-www-form-urlencoded)', function() {    
      var requestObj = { 
        method: 'GET',
        protocol: 'HTTPS',
        url: 'localhost/test?dd=e',
        protocolVersion: 'HTTP/2.0',
        host: 'localhost',
        headers: [ 
          { name: 'Connection', values: [ { value: 'keep-alive', params: null } ] },          
          { name: 'Cache-Control', values: [ { value: 'no-cache', params: null } ] },
          { name: 'User-Agent', values: [ 
            { value: 'Mozilla/5.0 (Windows NT 6.1 WOW64)', params: null } 
          ]},
          { name: 'Content-Type', values: [ { value: 'application/x-www-form-urlencoded', params: 'charset=UTF-8' } ] },
          { name: 'Content-Length', values: [ { value: '301', params: null } ] },
          { name: 'Accept', values: [ { value: '*/*', params: null } ] },
          { name: 'Accept-Encoding', values: [ 
            { value: 'gzip', params: null },
            { value: 'deflate', params: null }
          ]},
          { name: 'Accept-Language', values: [ 
            { value: 'ru-RU', params: null },
            { value: 'ru', params: 'q=0.8' },
            { value: 'en-US', params: 'q=0.6' },
            { value: 'en', params: 'q=0.4' } 
          ]}
        ],
        cookie: null,
        body: {
          contentType: 'application/x-www-form-urlencoded',
          boundary: null,
          formDataParams: [
            { name: "id", value: "11" },
            { name: "message", value: "Hello" }
          ] 
        } 
      };
      
      var expected = [
        'GET https://localhost/test?dd=e HTTP/2.0',
        'HOST: localhost',
        'Connection: keep-alive',      
        'Cache-Control: no-cache',
        'User-Agent: Mozilla/5.0 (Windows NT 6.1 WOW64)',
        'Content-Type: application/x-www-form-urlencoded;charset=UTF-8',
        'Content-Length: 301',
        'Accept: */*',
        'Accept-Encoding: gzip, deflate',
        'Accept-Language: ru-RU, ru;q=0.8, en-US;q=0.6, en;q=0.4',
        '',
        'id=11&message=Hello'
      ].join('\n');
    
      var actual = builder.build(requestObj);
      actual.should.eql(expected);
    });
  });

  describe('POST method', function() {
    it('should build plain request from valid object (with body ,contentType=multipart/form-data)', function() {
      var requestObj = { 
        method: 'POST',
        protocol: 'HTTP',
        url: 'localhost/test',
        protocolVersion: 'HTTP/2.1',
        host: 'localhost',
        headers: [ 
          { name: 'Connection', values: [ { value: 'keep-alive', params: null } ] },          
          { name: 'Cache-Control', values: [ { value: 'no-cache', params: null } ] },
          { name: 'User-Agent', values: [ 
            { value: 'Mozilla/5.0 (Windows NT 6.1 WOW64)', params: null } 
          ]},
          { name: 'Content-Type', values: [ { value: 'multipart/form-data', params: 'boundary=------11136253119209' } ] },
          { name: 'Content-Length', values: [ { value: '101', params: null } ] },
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
        ],
        body: {
          contentType: 'multipart/form-data',
          boundary: '------11136253119209',
          formDataParams: [
            { name: "Name", value: "Ivanov" },
            { name: "Age", value: "25" }
          ] 
        } 
      };
      
      var expected = [
        'POST http://localhost/test HTTP/2.1',
        'HOST: localhost',
        'Connection: keep-alive',      
        'Cache-Control: no-cache',
        'User-Agent: Mozilla/5.0 (Windows NT 6.1 WOW64)',
        'Content-Type: multipart/form-data;boundary=------11136253119209',
        'Content-Length: 101',        
        'Accept: */*',
        'Accept-Encoding: gzip, deflate',
        'Accept-Language: en-US;q=0.6, en;q=0.4',
        'Cookie: csrftoken=123abc; sessionid=456def',
        '',
        '-----------------------------11136253119209',
        'Content-Disposition: form-data; name="Name"',
        '',
        'Ivanov',
        '-----------------------------11136253119209',
        'Content-Disposition: form-data; name="Age"',
        '',
        '25',
        '-----------------------------11136253119209--'
      ].join('\n');      
    
      var actual = builder.build(requestObj);
      actual.should.eql(expected);
    });
    
    it('should build plain request from valid object (with body ,contentType=contentType=application/json)', function() {
      var requestObj = { 
        method: 'POST',
        protocol: 'HTTP',
        url: 'localhost/test?dd=e',
        protocolVersion: 'HTTP/1.1',
        host: 'localhost',
        headers: [ 
          { name: 'Connection', values: [ { value: 'keep-alive', params: null } ] },          
          { name: 'Cache-Control', values: [ { value: 'no-cache', params: null } ] },
          { name: 'User-Agent', values: [ 
            { value: 'Mozilla/5.0 (Windows NT 6.1 WOW64)', params: null }
          ]},
          { name: 'Content-Type', values: [ { value: 'application/json', params: null } ] },
          { name: 'Content-Length', values: [ { value: '501', params: null } ] },
          { name: 'Accept', values: [ { value: '*/*', params: null } ] },
          { name: 'Accept-Encoding', values: [ 
            { value: 'gzip', params: null },
            { value: 'deflate', params: null },
            { value: 'sdch', params: null } 
          ]},
          { name: 'Accept-Language', values: [ 
            { value: 'ru-RU', params: null },
            { value: 'ru', params: 'q=0.8' },
            { value: 'en-US', params: 'q=0.6' },
            { value: 'en', params: 'q=0.4' } 
          ]}
        ],
        cookie: [
          { name: 'csrftoken', value: '123abc' },
          { name: 'sessionid', value: '456def' }
        ],
        body: {
          contentType: 'application/json',
          boundary: null,
          plain: '{{"p1": "v1"}, {"p2": "v2"}}' 
        } 
      };
      
      var expected = [
        'POST http://localhost/test?dd=e HTTP/1.1',
        'HOST: localhost',
        'Connection: keep-alive',      
        'Cache-Control: no-cache',
        'User-Agent: Mozilla/5.0 (Windows NT 6.1 WOW64)',
        'Content-Type: application/json',
        'Content-Length: 501',        
        'Accept: */*',
        'Accept-Encoding: gzip, deflate, sdch',
        'Accept-Language: ru-RU, ru;q=0.8, en-US;q=0.6, en;q=0.4',
        'Cookie: csrftoken=123abc; sessionid=456def',
        '',
        '{{"p1": "v1"}, {"p2": "v2"}}'
      ].join('\n');
      
      var actual = builder.build(requestObj);
      actual.should.eql(expected);
    });
  });
});
