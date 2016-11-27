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
 * @param {any} func function taking the db connection and the callback.
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
    db.collection(collectionName).findOne(filter, (err, item) => {
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

// Add user in the database
exports.addUser = function addUser(user) {
    function func(db, callback) {
        insertOne(db, 'users', user, callback);
    }
    
    performOperation(func);
}

// Get user from the database
exports.getUser = function getUser(name, callback) {
    function func(db, callback) {
        findOne(db, 'users', { 'name': name }, callback);
    }

    performOperation(func);
}

// Update user in the database
function updateUser(user) {

}

// Delete user from the database
exports.deleteUser = function deleteUser(name) {

    performOperation(func);


    function func(db, callback) {
        deleteOne(db, 'users', { 'name': name }, callback);

    }    
}

