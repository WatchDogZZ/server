#!/usr/bin/env node
/**
 * @file run_server.js
 * @author Benjamin Barbesange && Benoît Garçon
 * 
 * @brief This file creates the web apps and handle the routing.
 */

/// Packages imports
var http = require('http');
var express = require('express');

/// Service files imports
var service = require('./service.methods.js');
var serviceEntities = require('./service.entities.js');

/// Configuration of constants
var SERVER_PORT = process.env.PORT || 80;


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
app.get('/', function (request, response) {
    response.send('<html><body><h1>Welcome to WatchDogZZ web service home!</h1></body></html>');

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
app.get('/where/:user?', function (request, response) {

    service.getUserLocationList(function (err, serviceList) {

        // TODO : error logger
        
        if (undefined !== request.params.user) {
            // If a user is specified, filter it

            var currentUser = serviceList.find(function (el, idx, arr) {
                return el.name == request.params.user;
            });

            if (undefined !== currentUser) {
                // User found, get the information and format it
                response.send({
                    'name': currentUser.name,
                    'location': currentUser.location
                });
            } else {
                // No user matching, sending default
                response.send({
                    'name': serviceEntities.defaultName,
                    'location': serviceEntities.defaultLocation
                });
            }

        } else {
            // If there is no filter, send back the full list

            response.send({
                'list': serviceList
            });
        }

        response.end();
    });
});

// '/users'
// Return the list of all connected users
app.get('/users', function (request, response) {

    service.getUsernameList(function (err, res) {
        
        
        response.send({
            'list': res
        });


        response.end();

    });
    
});


/******************************************************************************/
// Create the http server with the app
/******************************************************************************/

// The main http app
http.createServer(app).listen(app.get('port'), function () {
    // When the app is running
    console.log('[HTTP] app listening on port ' + app.get('port'));

});
