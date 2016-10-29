// Imports
var http = require('http');

// Constants
const SERVER_PORT = 3000;
 
// Create the server
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('<html><body><h1>Hello World</h1></body></html>');
}).listen(SERVER_PORT);
 
console.log('Server running on port ' + SERVER_PORT);