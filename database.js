/// This file contains all the functions to interact with the database

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

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
 * @param {string} name The name of the user to delete.
 * @param {resCallback} callback Called after the request.
 */
exports.deleteUser = function deleteUser(name, callback) {
    MongoClient.connect(DATABASE_URL, function (err, db) {

        if (null == err) {

            db.collection(USER_COLLECTION_NAME).deleteOne({ 'name': name }, function (err, res) {
                callback(err, res);
            });

        } else {
            callback(err, null);
        }

        db.close();
    });
}

/**
 * Create a new User in the database.
 *
 * @param {User} user The User instance to add in the database.
 * @param {resCallback} callback Called after the request.
 */
exports.createUser = function addUser(user, callback) {

    MongoClient.connect(DATABASE_URL, function (err, db) {

        db.collection(USER_COLLECTION_NAME).insertOne(user, function (err, res) {
            callback(err, res);
        });

        db.close();
    });
}

/**
 * Get a user using the username to select it.
 *
 * @param {string} name The name of the user to select.
 * @param {resCallback} callback Called after the request.
 */
exports.getUser = function (name, callback) {

    MongoClient.connect(DATABASE_URL, function (err, db) {

        db.collection(USER_COLLECTION_NAME).findOne({ 'name': name }, function (err, res) {

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

/**
 * Get the positions of each User.
 *
 * @param {resCallback} callback Called after the request.
 */
exports.getUserList = function (callback) {

    MongoClient.connect(DATABASE_URL, function (err, db) {

        db.collection(USER_COLLECTION_NAME).find().project({ _id: 0 }).toArray(function (err, item) {

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

    var nameFilter = user.getName();

    MongoClient.connect(DATABASE_URL, function (err, db) {

        db.collection(USER_COLLECTION_NAME).findOneAndReplace({ 'name': user.getName() }, user, function (err, res) {
            callback(err, res);
        });

        db.close();
    });

}

/**
 * Update the location of a user found by name
 * @param {String} userName The name of the user
 * @param {Array<Float>} location The array containing the new GPS coordinates
 * @param {resCallback} callback Called after the request
 */
exports.updateUserLocationByName = function (userName, location, callback) {

    MongoClient.connect(DATABASE_URL, function (err, db) {

        db.collection(USER_COLLECTION_NAME).findOneAndUpdate(
            { 'name': userName },
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