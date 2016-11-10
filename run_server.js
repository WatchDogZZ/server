/**
 * @file run_server.js
 * @author Benjamin Barbesange && Benoît Garçon
 * 
 * @brief This file creates the web apps and handle the routing.
 */

/// Packages imports
const http = require('http');
const express = require('express');

/// Service files imports
const service = require('./service.methods.js');
const serviceEntities = require('./service.entities.js');

/// Configuration constants
const SERVER_PORT = 3000;


/// Create the app
var app = express();


// Set the app properties
app.locals.title = 'WatchDogZZ Web service';
app.set('port', SERVER_PORT);

/******************************************************************************/
// Routing
/******************************************************************************/

// Handle get request on root
// Return simple html with greetings
app.get('/', (request, response) => {
    response.send(`
    <html>
        <body>
            <h1>Welcome to WatchDogZZ web service home!</h1>
        </body>
    </html>
    `);
});

// '/where/user'
// Return the location of a specific user. If user is ommited, return the positions
// of all connected users. If the user does not exist
app.get('/where/:user?', (request, response) => {

    if(undefined !== request.params.user) {

        var currentUser = service.getList().find( (el, idx, arr) => {
            return el.name == request.params.user;
        });

        if(undefined !== currentUser) {
            response.send(currentUser.position);
        } else {
            response.send( service.defaultLocation );
        }

    } else {

        response.send( service.getList() );
    }

    response.end();
});

// '/who'
// Return the list of all connected users
app.get('/who', (request, response) => {
    response.send(service.getUsers());
});


/******************************************************************************/
// Create the http server with the app
/******************************************************************************/

// The main http app
http.createServer(app).listen(app.get('port'), () => {
    // When the app is running
    console.log('[HTTP] app listening on port ' + app.get('port'));

});
