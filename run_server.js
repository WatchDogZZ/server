// Imports
const http = require('http'),
    express = require('express');

const service = require('./service_methods.js');


// Constants
const SERVER_PORT = 3000;


// Create the app
var app = express();


// Set properties
app.set('port', SERVER_PORT);


// Handle get request on root
app.get('/', (request, response) => {
    response.send(`
    <html>
        <body>
            <h1>Welcome to WatchDogZZ web service home!</h1>
        </body>
    </html>
    `);
});


app.get('/list', (request, response) => {
    response.send(service.getList());
});

// Create the server
http.createServer(app).listen(app.get('port'), () => {
    // Callback when the server is ready
    console.log('Server listening on port ' + app.get('port'));
})