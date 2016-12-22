/// This file contains all the functions to interact with the database

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var serviceEntities = require('./service.entities.js');

// Connection URL
var DATABASE_NAME = 'watchdogzz';
var DATABASE_PORT = 27017;
var DATABASE_URL = 'mongodb://localhost:' + DATABASE_PORT + '/' + DATABASE_NAME;


/******************************************************************************/
// General functions on the Database
/******************************************************************************/

/**
 * Perform an operation on the database.
 * 
 * @param {function} func function taking the db connection and the callback.
 */
function performOperation(func) {
    MongoClient.connect(DATABASE_URL, function (err, db) {

        func(db, function (err, result) {
            // general structure of the function to call
        });

        db.close();
    });
}

/**
 * Insert an object in the Database.
 * 
 * @param {any} db the connection on the database.
 * @param {any} collectionName the collection name to insert in.
 * @param {any} obj the object to insert in the collection.
 * @param {any} callback the callback invoked after the insert.
 */
function insertOne(db, collectionName, obj, callback) {
    db.collection(collectionName).insertOne(obj, callback);
}

/**
 * Find an object stored in the database.
 * 
 * @param {any} db the connection on the database.
 * @param {any} collectionName the collection name to look in.
 * @param {any} filter the filter object to find the object.
 * @param {any} callback the callback invoked after find.
 */
function findOne(db, collectionName, filter, callback) {
    db.collection(collectionName).findOne(filter, (item) => {
        callback(item);
    });
}

/**
 * Delete an object using a filter.
 * 
 * @param {any} db
 * @param {any} collectionName
 * @param {any} filter
 * @param {any} callback
 */
function deleteOne(db, collectionName, filter, callback) {
    db.collection(collectionName).deleteOne(filter, callback);
}

function updateOne(db, collectionName, filter, update, callback) {
    db.collection(collectionName).updateOne(filter, { $set: JSON.stringify(update) }, callback);
}

function replaceOne(db, collectionName, filter, replace, callback) {
    db.collection(collectionName).findOneAndReplace(filter, replace, callback);
}

function updateOne(db, collectionName, filter, update, callback) {
    db.collection(collectionName).findOneAndUpdate(filter, update, callback);
}

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

// Delete user from the database
exports.deleteUser = function deleteUser(name) {
    function func(db, callback) {
        deleteOne(db, USER_COLLECTION_NAME, { 'name': name }, callback);
    }

    performOperation(func);
}

// THIS FUNCTION DOES NOT WORK FFS !
exports.updateUser = function updateUser(user) {
    function func(db, callback) {
        // TODO use the _id ?
        replaceOne(db, USER_COLLECTION_NAME, { 'name': user.getName() }, user, callback);
    }

    performOperation(func);
}

exports.updateUserLocation = function updateUserLocation(name, location) {

    function func(db, callback) {
        updateOne(db, USER_COLLECTION_NAME, { 'name': name }, {
            $set: { 'location': location }
        }, callback);
    }

    performOperation(func);
}

// Add user in the database
exports.createUser = function addUser(user) {

    MongoClient.connect(DATABASE_URL, function (err, db) {

        db.collection(USER_COLLECTION_NAME).insertOne(user);

        db.close();
    });
}

// Select a user using the name. Use the callbach with an argument : the user.
exports.getUser = function (name, callback) {

    MongoClient.connect(DATABASE_URL, function (err, db) {

        db.collection(USER_COLLECTION_NAME).findOne({ 'name': name }, (err, val) => {
            callback(val);
        });

        db.close();
    });
}

exports.updateUser = function (user) {
    
    var nameFilter = user.getName();

    console.log("name filter");
    console.log(nameFilter);

    MongoClient.connect(DATABASE_URL, function (err, db) {

        db.collection(USER_COLLECTION_NAME).findOneAndUpdate({ 'name': user.getName() }, user);

        db.close();
    });

}