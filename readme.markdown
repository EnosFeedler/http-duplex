# http-duplex

Turn (req,res) pairs into a single readable/writable stream.

[![build status](https://secure.travis-ci.org/substack/http-duplex.png)](http://travis-ci.org/substack/http-duplex)

# example

``` js
var httpDuplex = require('http-duplex');
var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req, res) {
    var dup = httpDuplex(req, res);
    console.log(dup.method + ' ' + dup.url);
    
    dup.setHeader('content-type', 'text/plain');
    
    if (dup.method === 'POST') {
        dup.pipe(process.stdout, { end : false });
        dup.on('end', function () {
            dup.end('ok\n');
        });
    }
    else fs.createReadStream(__filename).pipe(dup)
});

server.listen(8484);
```

```
$ curl -s http://localhost:8484 | tail -n1
server.listen(8484);
$ curl -sd 'beep boop' http://localhost:8484
ok
```

# methods

``` js
var httpDuplex = require('http-duplex')
```

## var dup = httpDuplex(req, res)

Return a new readable/writable duplex stream `dup` from the http request `req`
and http response `res`.

`dup` has all the same methods has both `req` and `res`, but on a single object.

# install

With [npm](https://npmjs.org) do:

```
npm install http-duplex
```

# license

MIT
