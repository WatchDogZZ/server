// This file contains the service methods that interact with the data


// Requires
var entities = require('./service.entities.js');

var database = require('./database.js');

/// Add the user in the database
exports.login = function (user, callback) {
    
    database.createUser(user, function (err, res) {
        // Just pass to callback
        callback(err, res);
    });

}

/// Disconnect the user (remove it from db)
exports.logout = function (userToken, callback) {

    database.deleteUser(userToken, function (err, res) {

        callback(err, res);

    });

}
/// Just get the names of connected users
exports.getUsernameList = function (callback) {
    
    database.getUsernameList(function (err, res) {
        
        callback(err, res);

    });

}


/// Return a list of User instances
exports.getUserList = function ( callback ) {
    
    database.getUserList(function (err, res) {

        callback(err, res);

    });
}

/// Only return a list of objects containing names and locations
exports.getUserLocationList = function (callback) {
    

    database.getUserLocationList(function (err, res) {

        callback(err, res);

    });

}

/// Update the location of a user using its name
exports.updateUserLocation = function (userToken, location, callback) {
    
    database.updateUserLocationByToken(userToken, location, function (err, res) {

        callback(err, res);

    });
}

/// Check if the token is connected (res == false | true)
exports.checkToken = function (userToken, callback) {
    
    database.isTokenConnected(userToken, function (err, res) {

        callback(err, res);

    });
}