'use strict';

// Preprost statični strežnik nad mapo src/ za lokalni razvoj (npm start).
// Brez predpomnjenja, da se spremembe vidijo takoj ob osvežitvi.

var http = require('node:http');
var fs = require('node:fs');
var path = require('node:path');

var root = path.join(__dirname, '..', 'src');
var port = Number(process.env.PORT) || 8080;

var types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.json': 'application/json; charset=utf-8'
};

var server = http.createServer(function (req, res) {
  var urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath.endsWith('/')) {
    urlPath += 'index.html';
  }
  var filePath = path.join(root, urlPath);
  if (filePath.indexOf(root) !== 0) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  fs.readFile(filePath, function (err, data) {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Ni najdeno: ' + urlPath);
      return;
    }
    res.writeHead(200, {
      'Content-Type': types[path.extname(filePath)] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    res.end(data);
  });
});

server.listen(port, function () {
  console.log('Pin-Pin: http://localhost:' + port + '/');
});
