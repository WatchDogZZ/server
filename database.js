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

const USER_COLLECTION_NAME = 'usersCollection';

/**
 * Delete the user matching a username.
 *
 * @param {string} name The name of the user to delete.
 * @param {function} callback The callback taking the following parameters
 *     - err : The error of the request, null id there is no error
 *     - res : the result of th request
 */
exports.deleteUser = function deleteUser(name, callback) {
    MongoClient.connect(DATABASE_URL, function (err, db) {

        db.collection(USER_COLLECTION_NAME).deleteOne({ 'name': name }, (err, res) => {
            callback(err, res);
        });

        db.close();
    });
}

/**
 * Create a new User in the database.
 *
 * @param {User} user The User instance to add in the database.
 * @param {function} callback The callback taking the following parameters
 *     - err : The error of the request, null id there is no error
 *     - res : the result of th request
 */
exports.createUser = function addUser(user, callback) {

    MongoClient.connect(DATABASE_URL, function (err, db) {

        db.collection(USER_COLLECTION_NAME).insertOne(user, (err, res) => {
            callback(err, res);
        });

        db.close();
    });
}

/**
 * Get a user using the username to select it.
 *
 * @param {string} name The name of the user to select.
 * @param {function} callback The callback taking the following parameters
 *     - err : The error of the request, null id there is no error
 *     - res : the User entity retrived, null if the user is not found
 */
exports.getUser = function (name, callback) {

    MongoClient.connect(DATABASE_URL, function (err, db) {

        db.collection(USER_COLLECTION_NAME).findOne({ 'name': name }, (err, res) => {

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
 * @param {function} callback The callback taking the following parameters
 *     - err : The error of the request, null id there is no error
 *     - res : the list of string containing the usernames
 */
exports.getUsernameList = function (callback) {

    MongoClient.connect(DATABASE_URL, function (err, db) {

        db.collection(USER_COLLECTION_NAME).find().project({ _id: 0, name: 1 }).toArray((err, item) => {

            var nameArray = [];

            if (null != item) {
                item.forEach((val, idx, arr) => {
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
 * @param {function} callback The callback taking the following parameters
 *     - err : The error of the request, null id there is no error
 *     - res : a list containing User instances
 */
exports.getUserList = function (callback) {

    MongoClient.connect(DATABASE_URL, function (err, db) {

        db.collection(USER_COLLECTION_NAME).find().project({ _id: 0 }).toArray((err, item) => {

            var userArray = [];

            if (null != item) {
                item.forEach((val, idx, arr) => {
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
 * Update the User information.
 *
 * @param {User} user The user object with updated information.
 * @param {function} callback The callback taking the following parameters
 *     - err : The error of the request, null id there is no error
 *     - res : the result of th request
 */
exports.updateUser = function (user, callback) {

    var nameFilter = user.getName();

    MongoClient.connect(DATABASE_URL, function (err, db) {

        db.collection(USER_COLLECTION_NAME).findOneAndReplace({ 'name': user.getName() }, user, (err, res) => {
            callback(err, res);
        });

        db.close();
    });

}