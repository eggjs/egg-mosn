'use strict';

const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    success: true,
  }));
});

exports.start = async (port = 13330) => {
  return new Promise(resolve => {
    server.listen(port, resolve);
  });
};

exports.stop = async () => {
  server.close();
};
