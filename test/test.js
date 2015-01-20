/*
 * http-request-builder
 * Copyright(c) 2014-2015 AlexanderMac <amatsibarov@gmail.com>
 * MIT Licensed
 */

var _                   = require('lodash');
var builder             = require('../index');
var InvalidRequestError = require('../lib/invalid-request-error');
require('should');

describe('#build()', function() {
  
  describe('requestObject', function() {
    it('should throw error for undefined requestObject', function() {
      builder.build.bind(null, null).should.throw(InvalidRequestError, {
        message: 'requestObj must be not null'
      });
    });
  });
  
  describe('start-line', function() {
    var requestObj = { 
      method: 'GET',
      protocol: 'HTTP',
      url: 'app.com/features?p1=v1',
      protocolVersion: 'HTTP/1.1',
      host: 'app.com',
      headers: [
        { name: 'Connection', values: [ 
          { value: 'keep-alive' } 
        ]},
      ]
    };
    
    var requestMsg = [
      'GET http://app.com/features?p1=v1 HTTP/1.1',
      'HOST: app.com',
      'Connection: keep-alive',
      '',
      ''
    ];
    
    it('should throw Error for empty method, url, protocol or protocol version', function() {
      var ro = _.clone(requestObj, true);
      ro.method = null;
      builder.build.bind(null, ro).should.throw(InvalidRequestError, {
        message: 'Method, url, protocol and protocolVersion must be not empty'
      });
      
      ro = _.clone(requestObj, true);
      ro.url = null;
      builder.build.bind(null, ro).should.throw(InvalidRequestError, {
        message: 'Method, url, protocol and protocolVersion must be not empty'
      });
      
      ro = _.clone(requestObj, true);
      ro.protocol = null;
      builder.build.bind(null, ro).should.throw(InvalidRequestError, {
        message: 'Method, url, protocol and protocolVersion must be not empty'
      });
      
      ro = _.clone(requestObj, true);
      ro.protocolVersion = null;
      builder.build.bind(null, ro).should.throw(InvalidRequestError, {
        message: 'Method, url, protocol and protocolVersion must be not empty'
      });
    });
    
    it('should build start-line for not empty method, url, protocol and protocol version', function() {
      var ro = _.clone(requestObj, true);
      var rm = _.clone(requestMsg, true);
      
      var actual = builder.build(ro);
      actual.should.eql(rm.join('\n'));
    });
  });
  
  describe('host-line', function() {
    var requestObj = { 
      method: 'GET',
      protocol: 'HTTP',
      url: 'app.com/features?p1=v1',
      protocolVersion: 'HTTP/1.1',
      host: 'app.com',
      headers: [
        { name: 'Connection', values: [ 
          { value: 'keep-alive' } 
        ]},
      ]
    };
    
    var requestMsg = [
      'GET http://app.com/features?p1=v1 HTTP/1.1',
      'HOST: app.com',
      'Connection: keep-alive',
      '',
      ''
    ];
    
    it('should build host-line for valid url', function() {
      var ro = _.clone(requestObj, true);
      var rm = _.clone(requestMsg, true);
      
      ro.url = '/app.com/features?p1=v1';
      rm[1] = 'HOST: app.com';
      var actual = builder.build(ro);
      actual.should.eql(rm.join('\n'));
      
      ro.url = '//app.com/features?p1=v1';
      rm[1] = 'HOST: app.com';
      var actual = builder.build(ro);
      actual.should.eql(rm.join('\n'));
      
      ro.url = 'www.app.com/features?p1=v1';
      rm[0] = 'GET http://www.app.com/features?p1=v1 HTTP/1.1',
      rm[1] = 'HOST: app.com';
      var actual = builder.build(ro);
      actual.should.eql(rm.join('\n'));
    });
  });
  
  describe('headers', function() {
    var requestObj = { 
      method: 'GET',
      protocol: 'HTTP',
      url: 'app.com/features?p1=v1',
      protocolVersion: 'HTTP/1.1',
      host: 'app.com',
      headers: [ 
        { name: 'Connection', values: [ 
          { value: 'keep-alive' } 
        ]},          
        { name: 'Cache-Control', values: [ 
          { value: 'no-cache' } 
        ]},
        { name: 'User-Agent', values: [ 
          { value: 'Mozilla/5.0 (Windows NT 6.1 WOW64)' } 
        ]},
        { name: 'Accept', values: [ 
          { value: '*/*'},
          { value: 'text/plain' }
        ]},
        { name: 'Accept-Encoding', values: [ 
          { value: 'gzip' },
          { value: 'deflate' }
        ]},
        { name: 'Accept-Language', values: [ 
          { value: 'ru-RU' },
          { value: 'ru', params: 'q=0.8' },
          { value: 'en-US', params: 'q=0.6' },
          { value: 'en', params: 'q=0.4' } 
        ]}
      ]
    };
    
    var requestMsg = [
      'GET http://app.com/features?p1=v1 HTTP/1.1',
      'HOST: app.com',
      'Connection: keep-alive',      
      'Cache-Control: no-cache',
      'User-Agent: Mozilla/5.0 (Windows NT 6.1 WOW64)',
      'Accept: */*, text/plain',
      'Accept-Encoding: gzip, deflate',
      'Accept-Language: ru-RU, ru;q=0.8, en-US;q=0.6, en;q=0.4',
      '',
      ''
    ];
    
    it('should throw Error for empty or invalid type headers list', function() {
      var ro = _.clone(requestObj, true);
      
      ro.headers = null;
      builder.build.bind(null, ro).should.throw(InvalidRequestError, {
        message: 'Headers list must be not empty'
      });
      
      ro.headers = {};
      builder.build.bind(null, ro).should.throw(InvalidRequestError, {
        message: 'Headers list must be not empty'
      });
      
      ro.headers = [];
      builder.build.bind(null, ro).should.throw(InvalidRequestError, {
        message: 'Headers list must be not empty'
      });
    });
    
    it('should throw Error for invalid header', function() {
      var ro = _.clone(requestObj, true);
      
      ro.headers[0].name = null;
      builder.build.bind(null, ro).should.throw(InvalidRequestError, {
        message: 'Header name must be not empty'
      });
      
      ro = _.clone(requestObj, true);
      ro.headers[0].values = null;
      builder.build.bind(null, ro).should.throw(InvalidRequestError, {
        message: 'Header values list must be not empty'
      });
      
      ro.headers[0].values = {};
      builder.build.bind(null, ro).should.throw(InvalidRequestError, {
        message: 'Header values list must be not empty'
      });
      
      ro.headers[0].values = [];
      builder.build.bind(null, ro).should.throw(InvalidRequestError, {
        message: 'Header values list must be not empty'
      });
      
      ro.headers[0].values = [
        { value: 'keep-alive' },
        { value: null }
      ];
      builder.build.bind(null, ro).should.throw(InvalidRequestError, {
        message: 'Header value must be not empty'
      });
    });
    
    it('should build header-lines for valid headers objects list', function() {
      var ro = _.clone(requestObj, true);
      var rm = _.clone(requestMsg, true);
      
      var actual = builder.build(ro);
      actual.should.eql(rm.join('\n'));
    });
  });
  
  describe('cookie', function() {
    var requestObj = { 
      method: 'GET',
      protocol: 'HTTP',
      url: 'app.com/features?p1=v1',
      protocolVersion: 'HTTP/1.1',
      host: 'app.com',
      headers: [ 
        { name: 'Connection', values: [ 
          { value: 'keep-alive' } 
        ]},          
        { name: 'Cache-Control', values: [ 
          { value: 'no-cache' } 
        ]},
        { name: 'User-Agent', values: [ 
          { value: 'Mozilla/5.0 (Windows NT 6.1 WOW64)' } 
        ]},
        { name: 'Accept', values: [ 
          { value: '*/*' } 
        ]},
        { name: 'Accept-Encoding', values: [ 
          { value: 'gzip' },
          { value: 'deflate' }
        ]},
        { name: 'Accept-Language', values: [ 
          { value: 'ru-RU' },
          { value: 'ru', params: 'q=0.8' },
          { value: 'en-US', params: 'q=0.6' },
          { value: 'en', params: 'q=0.4' } 
        ]}
      ],
      cookie: [
        { name: 'csrftoken', value: '123abc' },
        { name: 'sessionid', value: '456def' }
      ]
    };
    
    var requestMsg = [
      'GET http://app.com/features?p1=v1 HTTP/1.1',
      'HOST: app.com',
      'Connection: keep-alive',      
      'Cache-Control: no-cache',
      'User-Agent: Mozilla/5.0 (Windows NT 6.1 WOW64)',
      'Accept: */*',
      'Accept-Encoding: gzip, deflate',
      'Accept-Language: ru-RU, ru;q=0.8, en-US;q=0.6, en;q=0.4',
      'Cookie: csrftoken=123abc; sessionid=456def',
      '',
      ''
    ];
    
    it('should throw Error for empty or invalid type cookie list', function() {
      var ro = _.clone(requestObj, true);
      
      ro.cookie = [];
      builder.build.bind(null, ro).should.throw(InvalidRequestError, {
        message: 'Cookie name-value pairs list must be not empty'
      });
      
      ro.cookie = {};
      builder.build.bind(null, ro).should.throw(InvalidRequestError, {
        message: 'Cookie name-value pairs list must be not empty'
      });
    });
    
    it('should throw Error for invalid cookie list', function() {
      var ro = _.clone(requestObj, true);
      
      ro.cookie = [
        { name: '', value: '123abc' },
        { name: 'sessionid', value: '456def' }
      ];
      builder.build.bind(null, ro).should.throw(InvalidRequestError, {
        message: 'Cookie name or value must be not empty'
      });
      
      ro.cookie = [
        { name: 'csrftoken', value: '123abc' },
        { name: 'sessionid', value: '' }
      ];
      builder.build.bind(null, ro).should.throw(InvalidRequestError, {
        message: 'Cookie name or value must be not empty'
      });
    });
    
    it('should not throw Error for empty cookie', function() {
      var ro = _.clone(requestObj, true);
      var rm = _.clone(requestMsg, true);
      
      ro.cookie = null;
      rm.splice(8, 1);
      
      var actual = builder.build(ro);
      actual.should.be.eql(rm.join('\n'));
    });
    
    it('should build cookie-line for valid cookie object', function() {
      var ro = _.clone(requestObj, true);
      var rm = _.clone(requestMsg, true);
      
      var actual = builder.build(ro);
      actual.should.be.eql(rm.join('\n'));
    });
  });
  
  describe('body', function() {
    var requestObj = { 
      method: 'GET',
      protocol: 'HTTP',
      url: 'app.com/features?p1=v1',
      protocolVersion: 'HTTP/1.1',
      host: 'app.com',
      headers: [ 
        { name: 'Connection', values: [ 
          { value: 'keep-alive' } 
        ]},          
        { name: 'Cache-Control', values: [ 
          { value: 'no-cache' } 
        ]},
        { name: 'User-Agent', values: [ 
          { value: 'Mozilla/5.0 (Windows NT 6.1 WOW64)' } 
        ]},
        { name: 'Accept', values: [ 
          { value: '*/*' } 
        ]},
        { name: 'Accept-Encoding', values: [ 
          { value: 'gzip' },
          { value: 'deflate' }
        ]},
        { name: 'Accept-Language', values: [ 
          { value: 'ru-RU' },
          { value: 'ru', params: 'q=0.8' },
          { value: 'en-US', params: 'q=0.6' },
          { value: 'en', params: 'q=0.4' } 
        ]},
        { name: 'Content-Type', values: [ 
          { value: 'application/x-www-form-urlencoded', params: 'charset=UTF-8' } 
        ]},
        { name: 'Content-Length', values: [ 
          { value: '301' } 
        ]}
      ]
    };
    
    var requestMsg = [
      'GET http://app.com/features?p1=v1 HTTP/1.1',
      'HOST: app.com',
      'Connection: keep-alive',      
      'Cache-Control: no-cache',
      'User-Agent: Mozilla/5.0 (Windows NT 6.1 WOW64)',
      'Accept: */*',
      'Accept-Encoding: gzip, deflate',
      'Accept-Language: ru-RU, ru;q=0.8, en-US;q=0.6, en;q=0.4',
      'Content-Type: application/x-www-form-urlencoded;charset=UTF-8',
      'Content-Length: 301',
      '',
      ''
    ];
    
    it('should throw Error for ContentType=application/x-www-form-urlencoded and empty or invalid type formDataParams list', function() {
      var ro = _.clone(requestObj, true);
      
      ro.headers[6].values = [{
        value: 'application/x-www-form-urlencoded'
      }];
      ro.body = {
        contentType: 'application/x-www-form-urlencoded',
      };
      
      ro.body.formDataParams = null;
      builder.build.bind(null, ro).should.throw(InvalidRequestError, {
        message: 'Body with ContentType=application/x-www-form-urlencoded must have parameters'
      });
      
      ro.body.formDataParams = {};
      builder.build.bind(null, ro).should.throw(InvalidRequestError, {
        message: 'Body with ContentType=application/x-www-form-urlencoded must have parameters'
      });
      
      ro.body.formDataParams = [];
      builder.build.bind(null, ro).should.throw(InvalidRequestError, {
        message: 'Body with ContentType=application/x-www-form-urlencoded must have parameters'
      });
    });
    
    it('should throw Error for ContentType=application/x-www-form-urlencoded and invalid formDataParams list', function() {
      var ro = _.clone(requestObj, true);
      
      ro.headers[6].values = [{
        value: 'application/x-www-form-urlencoded'
      }];
      ro.body = {
        contentType: 'application/x-www-form-urlencoded',
      };
      
      ro.body.formDataParams = [
        { name: '', value: '11' },
        { name: 'message', value: 'Hello' }
      ];
      builder.build.bind(null, ro).should.throw(InvalidRequestError, {
        message: 'FormData parameter must have name and value'
      });
      
      ro.body.formDataParams = [
        { name: '', value: '11' },
        { name: 'message', value: '' }
      ];
      builder.build.bind(null, ro).should.throw(InvalidRequestError, {
        message: 'FormData parameter must have name and value'
      });
    });
    
    it('should throw Error for ContentType=multipart/form-data and empty boundary', function() {
      var ro = _.clone(requestObj, true);
      
      ro.headers[6].values = [{
        value: 'multipart/form-data'
      }];
      ro.body = {
        contentType: 'multipart/form-data',
        formDataParams: [
          { name: '', value: '11' },
          { name: 'message', value: 'Hello' }
        ]
      };
      builder.build.bind(null, ro).should.throw(InvalidRequestError, {
        message: 'Body with ContentType=multipart/form-data must have boundary in ContentType header'
      });
    });
    
    it('should throw Error for ContentType=multipart/form-data and empty or invalid type formDataParams list', function() {
      var ro = _.clone(requestObj, true);
      
      ro.headers[6].values = [{
        value: 'multipart/form-data',
        params: 'boundary=------11136253119209'
      }];
      ro.body = {
        contentType: 'multipart/form-data',
        boundary: '------11136253119209'
      };
      
      ro.body.formDataParams = null;
      builder.build.bind(null, ro).should.throw(InvalidRequestError, {
        message: 'Body with ContentType=multipart/form-data must have parameters'
      });
      
      ro.body.formDataParams = {};
      builder.build.bind(null, ro).should.throw(InvalidRequestError, {
        message: 'Body with ContentType=multipart/form-data must have parameters'
      });
      
      ro.body.formDataParams = [];
      builder.build.bind(null, ro).should.throw(InvalidRequestError, {
        message: 'Body with ContentType=multipart/form-data must have parameters'
      });
    });
    
    it('should throw Error for ContentType=multipart/form-data and invalid formDataParams list', function() {
      var ro = _.clone(requestObj, true);
      
      ro.headers[6].values = [{
        value: 'multipart/form-data',
        params: 'boundary=------11136253119209'
      }];
      ro.body = {
        contentType: 'multipart/form-data',
        boundary: '------11136253119209'
      };
      
      ro.body.formDataParams = [
        { name: '', value: '11' },
        { name: 'message', value: 'Hello' }
      ];
      builder.build.bind(null, ro).should.throw(InvalidRequestError, {
        message: 'FormData parameter must have name and value'
      });
      
      ro.body.formDataParams = [
        { name: '', value: '11' },
        { name: 'message', value: '' }
      ];
      builder.build.bind(null, ro).should.throw(InvalidRequestError, {
        message: 'FormData parameter must have name and value'
      });
    });
    
    it('should build body with ContentType=application/x-www-form-urlencoded', function() {
      var ro = _.clone(requestObj, true);
      var rm = _.clone(requestMsg, true);
      
      ro.headers[6].values = [{
        value: 'application/x-www-form-urlencoded',
        params: 'charset=UTF-8'
      }];
      ro.body = {
        contentType: 'application/x-www-form-urlencoded',
        formDataParams: [
          { name: 'id', value: '11' },
          { name: 'message', value: 'Hello' }
        ]
      };
      
      rm[11] = 'id=11&message=Hello';
      
      var actual = builder.build(ro);
      actual.should.be.eql(rm.join('\n'));
    });
    
    it('should build body with ContentType=multipart/form-data', function() {
      var ro = _.clone(requestObj, true);
      var rm = _.clone(requestMsg, true);
      
      ro.headers[6].values = [{ 
        value: 'multipart/form-data', 
        params: 'boundary=------11136253119209'
      }]; 
      ro.body = {
        contentType: 'multipart/form-data',
        boundary: '------11136253119209',
        formDataParams: [
          { name: 'Name', value: 'Ivanov' },
          { name: 'Age', value: '25' }
        ] 
      };
      
      rm[8] = 'Content-Type: multipart/form-data;boundary=------11136253119209';
      rm[11] = '-----------------------------11136253119209';
      rm[12] = 'Content-Disposition: form-data; name="Name"';
      rm[13] = '';
      rm[14] = 'Ivanov';
      rm[15] = '-----------------------------11136253119209';
      rm[16] = 'Content-Disposition: form-data; name="Age"';
      rm[17] = '';
      rm[18] = '25';
      rm[19] = '-----------------------------11136253119209--';
      
      var actual = builder.build(ro);
      actual.should.be.eql(rm.join('\n'));
    });
    
    it('should build body with ContentType=application/json', function() {
      var ro = _.clone(requestObj, true);
      var rm = _.clone(requestMsg, true);      
      
      ro.headers[6].values = [{
        value: 'application/json'
      }];
      ro.body = {
        contentType: 'application/json',
        plain: '{{"p1": "v1"}, {"p2": "v2"}}'
      };
      
      rm[8] = 'Content-Type: application/json';
      rm[11] = '{{"p1": "v1"}, {"p2": "v2"}}';
    
      var actual = builder.build(ro);
      actual.should.be.eql(rm.join('\n'));
    });
    
    it('should build body with ContentType=application/json and cookie', function() {
      var ro = _.clone(requestObj, true);
      var rm = _.clone(requestMsg, true);      
      
      ro.headers[6].values = [{
        value: 'application/json'
      }];
      ro.cookie = [
        { name: 'csrftoken', value: '123abc' },
        { name: 'sessionid', value: '456def' }
      ];
      ro.body = {
        contentType: 'application/json',
        plain: '{{"p1": "v1"}, {"p2": "v2"}}'
      };
      
      rm[8] = 'Content-Type: application/json';
      rm[10] = 'Cookie: csrftoken=123abc; sessionid=456def';
      rm[12] = '{{"p1": "v1"}, {"p2": "v2"}}';
    
      var actual = builder.build(ro);
      actual.should.be.eql(rm.join('\n'));
    });
  });

});
