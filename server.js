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
const SERVER_PORT = process.env.PORT || 80;


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

    response.end();
});

// Middleware for each request
// Adding header properties
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// '/where/user'
// Return the location of a specific user. If user is ommited, return the positions
// of all connected users. If the user does not exist
app.get('/where/:user?', (request, response) => {

    var serviceList = service.getList();

    if(undefined !== request.params.user) {

        var currentUser = serviceList.find( (el, idx, arr) => {
            return el.name == request.params.user;
        });

        if (undefined !== currentUser) {
            response.send({
                "position": currentUser.position
            });
        } else {
            response.send({
                "position": service.defaultLocation
            });
        }

    } else {

        response.send({
            "list": serviceList
        });
    }

    response.end();
});

// '/users'
// Return the list of all connected users
app.get('/users', (request, response) => {
    response.send({
        "users": service.getUsers()
    });
    
    response.end();

});


/******************************************************************************/
// Create the http server with the app
/******************************************************************************/

// The main http app
http.createServer(app).listen(app.get('port'), () => {
    // When the app is running
    console.log('[HTTP] app listening on port ' + app.get('port'));

});
