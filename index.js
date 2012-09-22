var Stream = require('stream');
var inherits = require('inherits');

var resMethods = [
    'write', 'end', 'destroy', 'flush',
    'writeHeader', 'writeHead', 'writeContinue',
    'setHeader', 'getHeader', 'removeHeader', 'addTrailers',
];
var reqMethods = [
    'pause', 'resume', 'setEncoding', 'destroy'
];

var reqProps = [
    'client', 'complete', 'connection',
    'headers', 'httpVersion', 'httpVersionMajor', 'httpVersionMinor',
    'method', 'readable', 'socket', 'trailers', 'upgrade', 'url'
];
var reqEvents = [ 'data', 'end', 'close', 'error' ];

function HttpDuplex (req, res) {
    var self = this;
    self.request = req;
    self.response = res;
    
    self.writable = true;
    self.readable = true;
    
    reqEvents.forEach(function (name) {
        var emit = self.emit.bind(self, name);
        req.on(name, function () {
            emit.apply(null, arguments);
        });
    });
    
    res.on('error', function () {
        self.emit.bind(self, 'error').apply(null, arguments);
    });
    
    Object.defineProperty(self, 'statusCode', {
        get : function () {
            return res.statusCode;
        },
        set : function (code) {
            res.statusCode = code;
        },
        enumerable : true
    });
    
    reqProps.forEach(function (name) {
        Object.defineProperty(self, name, {
            get : function () {
                return req[name];
            },
            enumerable : true
        });
    });
}

inherits(HttpDuplex, Stream);

reqMethods.forEach(function (name) {
    HttpDuplex.prototype[name] = function () {
        this.request[name].apply(this.request, arguments);
    };
});

resMethods.forEach(function (name) {
    HttpDuplex.prototype[name] = function () {
        this.response[name].apply(this.response, arguments);
    };
});

module.exports = function (req, res) {
    return new HttpDuplex(req, res);
};
