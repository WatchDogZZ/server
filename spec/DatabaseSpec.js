// Testing the database functions

var MongoClient = require('mongodb').MongoClient;
const database = require('../database.js');
const serviceEntities = require('../service.entities');

var DATABASE_NAME = 'watchdogzz';
var DATABASE_PORT = 27017;
var DATABASE_URL = 'mongodb://localhost:' + DATABASE_PORT + '/' + DATABASE_NAME;

describe("Mongo database", function () {

    it('should connect to the Database', function (done) {

        database.connect();

        done();
    });

    const user1Name = 'Testeur1';
    const user1Location = [10.0, 10.0, 10.0];

    it('should create a new user', function (done) {

        var user1 = new serviceEntities.User(user1Name, user1Location);

        // database.addUser(user1);
        database.addUser(user1);

        MongoClient.connect(DATABASE_URL, (err, db) => {
            db.collection('users').count().then((c) => {
                expect(c).toEqual(1);
            });
        });

        done();
    });


    it('should retrieve the created user', function (done) {

        // Get the user and test it in the callback        
        database.getUser(user1Name, (item) => {

            // Instance of a user to use the methods after            
            var user = new serviceEntities.User(item);

            expect(user.getName(), user1Name);
            expect(user.getLocation(), user1Location);
        });

        done();

    });


    it('should delete the user', function (done) {

        database.deleteUser(user1Name);

        MongoClient.connect(DATABASE_URL, (err, db) => {
            db.collection('users').count().then((c) => {
                expect(c).toEqual(0);
            });
        });

        done();

    });

    // Clear the base    
    MongoClient.connect(DATABASE_URL, (err, db) => {
        db.collection('users').drop();
    });

});