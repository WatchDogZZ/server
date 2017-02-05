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
var bodyParser = require('body-parser');

/// Service files imports
var service = require('./service.methods.js');
var serviceEntities = require('./service.entities.js');

/// Configuration of constants
var SERVER_PORT = process.env.PORT || 80;

// Set the title to stop it more simply
process.title = watchdogzz;

/// Create the app
var app = express();

/******************************************************************************/
// Config
/******************************************************************************/

app.locals.title = 'WatchDogZZ Web service';
app.set('port', SERVER_PORT);

app.use(bodyParser.json()); // Parse JSON and place it in body

// Middleware for each request
// Adding header properties
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//   next();
// });


/******************************************************************************/
// Errors
/******************************************************************************/

const ERROR_503 = {
    'status': 'fail',
    'error': 'Database error'
}

const ERROR_400 = {
    'status': 'fail',
    'error': 'Internal server error'
}


/******************************************************************************/
// Routing
/******************************************************************************/

// GET '/'
// Handle get request on root
// Return simple html with greetings
app.get('/', function (request, response) {
    response.send(`
    <html>
        <body>
            <h1>Welcome to WatchDogZZ web service home!</h1>
        </body>
    </html>
    `);

    response.end();
});

// POST '/login'
// Will parse the JSON body and create the user in the db
// If the user uses other methods without the login, it will receive an error
app.post('/login', function (request, response) {

    // Get parameters    
    var name = request.body.name || null;
    var location = request.body.location || null;

    // Check the parameters
    if (null != name && null != location) {
        var user = new serviceEntities.User(name, location);

        service.login(user, function (err, res) {

            if (null == err) {
                response.status(200);
                response.send({
                    'status': 'ok',
                    'id': res['_id'] // TODO: get the id oh the created user
                });

            } else {
                response.status(503);
                response.send(ERROR_503);

            }

            response.end();
        });

    } else {
        response.status(400)
        response.send(ERROR_400);
        response.end();
    }

});


// POST '/logout'
// Parse the JSON body and delete the user from the database
// The user will disapear from the map on the phone
app.post('/logout', function (request, response) {

    // Get parameters
    var name = request.body.name || null;

    if (null != name) {
        service.logout(request.body.name, function (err, res) {

            if (null == err) {
                response.status(200);
                response.send({
                    'status': 'ok'
                });
            } else {
                response.status(503);
                response.send(ERROR_503);
            }

            response.end();
        });
    } else {
        response.status(400);
        response.send(ERROR_400);
        response.end();
    }


});

// GET '/where/user'
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
                response.status(200);
                response.send({
                    'name': currentUser.name,
                    'location': currentUser.location
                });
            } else {
                // No user matching, sending default
                response.status(200);
                response.send({
                    'name': serviceEntities.defaultName,
                    'location': serviceEntities.defaultLocation
                });
            }

        } else {
            // If there is no filter, send back the full list
            response.status(200);
            response.send({
                'list': serviceList
            });
        }

        response.end();
    });
});

// POST '/where'
// Update the user position
// Pass a JSON containing the name, and the location
app.post('/where', function (request, response) {

    var name = request.body.name || null;
    var location = request.body.location || null;

    if (null != name && null != location) {

        // Check if the user is there
        service.getUsernameList(function (err, res) {

            // If the user is not here, just log him
            if (-1 == res.indexOf(name)) {
                var user = new serviceEntities.User(name, location);

                service.login(user, function (err, res) {

                    if (null == err) {
                        response.status(200);
                        response.send({
                            'status': 'ok'
                        });

                    } else {
                        response.status(503);
                        response.send(ERROR_503);

                    }

                    response.end();
                });

            } else {

                // Just update the location
                service.updateUserLocation(name, location, function (err, res) {

                    if (null == err) {
                        response.status(200);
                        response.send({
                            'status': 'ok'
                        });
                        response.end();

                    } else {
                        response.status(503);
                        response.send(ERROR_503);
                        response.end();

                    }
                });
            }
        });


    } else {
        response.status(400);
        response.send(ERROR_400);
        response.end();
    }

});

// GET '/users'
// Return the list of all connected users
app.get('/who', function (request, response) {

    service.getUsernameList(function (err, res) {

        if (null == err) {
            response.status(200);
            response.send({
                'list': res
            });
            response.end();

        } else {
            response.status(200);
            response.send({
                'list': res
            });
            response.end();

        }



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
