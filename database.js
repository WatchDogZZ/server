/// This file contains all the functions to interact with the database

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var winston = require('winston');

var serviceEntities = require('./service.entities.js');

// Connection URL
var DATABASE_NAME = 'watchdogzz';
var DATABASE_PORT = 27017;
var DATABASE_URL = 'mongodb://localhost:' + DATABASE_PORT + '/' + DATABASE_NAME;


/**
 * Establish the connection on the database and close it immediately.
 */
exports.connect = function connect() {
    // Use connect method to connect to the server
    MongoClient.connect(DATABASE_URL, function (err, db) {
        assert.equal(null, err);

        db.close();
    });
}

/******************************************************************************/
// Users manipulation functions
/******************************************************************************/

var USER_COLLECTION_NAME = 'usersCollection';

/**
 * Delete the user matching a username.
 *
 * @param {string} token The token of the user to delete.
 * @param {resCallback} callback Called after the request.
 */
exports.deleteUser = function deleteUser(token, callback) {
    MongoClient.connect(DATABASE_URL, function (err, db) {

        if (null == err) {

            db.collection(USER_COLLECTION_NAME).deleteOne({ 'token': token }, function (err, res) {
                callback(err, res);
            });

        } else {
            callback(err, null);
            winston.error('MongoDB error on deleteUser', err);
        }

        db.close();
    });
}

/**
 * Create a new User in the database. If the user is already here (same token),
 *  replace its data with the new ones
 *
 * @param {User} user The User instance to add in the database.
 * @param {resCallback} callback Called after the request.
 */
exports.createUser = function addUser(user, callback) {

    MongoClient.connect(DATABASE_URL, function (err, db) {

        db.collection(USER_COLLECTION_NAME).findOneAndReplace(
            { 'token': user.getToken() }, // filter
            user, // doc to insert
            { upsert: true }, // upsert : will create if none is found
            function (err, res) { // res callback
            callback(err, res);
        });

/*        
        db.collection(USER_COLLECTION_NAME).insertOne(user, function (err, res) {
            callback(err, res);
        });
*/
        
        db.close();
    });
}

/**
 * Get a user using the username to select it.
 *
 * @param {string} token The name of the user to select.
 * @param {resCallback} callback Called after the request.
 */
exports.getUser = function (token, callback) {

    MongoClient.connect(DATABASE_URL, function (err, db) {

        db.collection(USER_COLLECTION_NAME).findOne({ 'token': token }, function (err, res) {

            if (null != res) {
                // If we have a result, load a User entity
                res = serviceEntities.loadUserFromMongoDocument(res);
            }

            callback(err, res);
        });

        db.close();
    });
}

/**
 * Get the username list of connected users.
 *
 * @param {resCallback} callback Called after the request.
 */
exports.getUsernameList = function (callback) {

    MongoClient.connect(DATABASE_URL, function (err, db) {

        db.collection(USER_COLLECTION_NAME).find().project({ _id: 0, name: 1 }).toArray(function (err, item) {

            var nameArray = [];

            if (null != item) {
                item.forEach(function (val, idx, arr) {
                    nameArray.push(val['name']);
                });
            }


            callback(err, nameArray);
        });

        db.close();

    });

}

exports.isTokenConnected = function (token, callback) {

    MongoClient.connect(DATABASE_URL, function (err, db) {
        
        db.collection(USER_COLLECTION_NAME).findOne({ 'token': token }, function (err, res) {

            if (null != res) {
                // Yes we have it connected
                callback(err, true);

            } else {
                // No we do not have it connected
                callback(err, false);

            }
        });
        
        db.close();
    });

}

/**
 * Get the positions of each User.
 *
 * @param {resCallback} callback Called after the request.
 */
exports.getUserList = function (callback) {

    MongoClient.connect(DATABASE_URL, function (err, db) {

        db.collection(USER_COLLECTION_NAME).find().project({ _id: 0, token: 0 }).toArray(function (err, item) {

            var userArray = [];

            if (null != item) {
                item.forEach(function (val, idx, arr) {
                    if (val != null) {
                        userArray.push(serviceEntities.loadUserFromMongoDocument(val));
                    }
                });
            }

            callback(err, userArray);
        });


        db.close();

    });

}

/**
 * Get the positions of each User. This method only returns names and locations
 *
 * @param {resCallback} callback Called after the request.
 */
exports.getUserLocationList = function (callback) {

    MongoClient.connect(DATABASE_URL, function (err, db) {

        db.collection(USER_COLLECTION_NAME).find().project({ _id: 0, name:1, location:1 }).toArray(function (err, item) {

            var userArray = [];

            if (null != item) {
                item.forEach(function (val, idx, arr) {
                    if (val != null) {
                        userArray.push( val );
                    }
                });
            }

            callback(err, userArray);
        });


        db.close();

    });

}


/**
 * Update the User information.
 *
 * @param {User} user The user object with updated information.
 * @param {resCallback} callback Called after the request.
 */
exports.updateUser = function (user, callback) {

    var token = user.getToken();

    MongoClient.connect(DATABASE_URL, function (err, db) {

        db.collection(USER_COLLECTION_NAME).findOneAndReplace({ 'token': token }, user, function (err, res) {
            callback(err, res);
        });

        db.close();
    });

}

/**
 * Update the location of a user found by name
 * @param {String} userToken The token of the user
 * @param {Array<Float>} location The array containing the new GPS coordinates
 * @param {resCallback} callback Called after the request
 */
exports.updateUserLocationByToken = function (userToken, location, callback) {

    MongoClient.connect(DATABASE_URL, function (err, db) {

        db.collection(USER_COLLECTION_NAME).findOneAndUpdate(
            { 'token': userToken },
            {
                $set:
                { 'location': location }
            },
            function (err, res) {
                callback(err, res);
            }
        );

        db.close();
    });

}

/******************************************************************************/
// Doc section
/******************************************************************************/

/**
 * Callback used to manipulate the result of a request.
 * @callback resCallback
 * @param {any} err Error object if the request fails. The object is null if there is no error.
 * @param {any} res The result of the request. transformed in a service entity type.
 */