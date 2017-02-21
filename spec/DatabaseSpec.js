// Testing the database functions

// Requires
var MongoClient = require('mongodb').MongoClient;
var database = require('../database.js');
var serviceEntities = require('../service.entities');


// Global data for testing
database.DATABASE_NAME = 'watchdogzztest';
database.DATABASE_PORT = 27017;
database.DATABASE_URL = 'mongodb://localhost:' + database.DATABASE_PORT + '/' + database.DATABASE_NAME;

describe('Mongo database', function () {

    it('should connect to the Database', function () {

        database.connect();

    });


    var user1Name = 'Testeur1';
    var user1Location = [10.0, 10.0, 10.0];
    var user1Token = "1";
    var user1 = new serviceEntities.User(user1Name, user1Location, user1Token);

    it('should create a new user', function (done) {

        database.createUser(user1, function (err, res) {
            expect(err).toBeNull();

            done();
        });
    });

    it ('should check that the token is connected', function (done) {

        database.isTokenConnected(user1Token, function (err, res) {

            expect(err).toBeNull();

            expect(res).toBe(true);

            done();
        });

    });

    it('should check that the token is not connected', function (done) {
        
        database.isTokenConnected('0', function (err, res) {
            expect(err).toBeNull();
            expect(res).toBe(false);
            done();
        });

    });

    it('should retrieve the created user', function (done) {

        // Get the user and test it in the callback
        database.getUser(user1Token, function (err, item) {

            expect(err).toBeNull();
            expect(item).not.toBeNull();

            // Check the 3 required fields
            expect(item.getName(), user1Name);
            expect(item.getLocation(), user1Location);
            expect(item.getToken(), user1Token);

            done();
        });

    });


    var newLo = 11.0;
    var newLa = 22.0;
    var newEl = 33.0;

    var loc = [newLo, newLa, newEl];

    it('should update the user location', function (done) {

        database.updateUserLocationByToken(user1Token, loc, function (err, item1) {

            // Just testing the error here            
            expect(err).toBeNull();

            user1.setLocation(loc) // Update this var to match next tests

            done();

        });

    });

    it('should match the location updated value', function (done) {

        // Check if the modifications are ok        
        database.getUser(user1Token, function (err, item2) {

            expect(err).toBeNull();
            expect(item2).not.toBeNull();

            expect(item2.getLocation()).toEqual(loc);

            done();
        });

    });


    var user2Name = 'Testeur2';
    var user2Location = [20.0, 20.0, 20.0];
    var user2Token = "2";
    var user2 = new serviceEntities.User(user2Name, user2Location, user2Token);

    var user3Name = 'Testeur3';
    var user3Location = [30.0, 30.0, 30.0];
    var user3Token = "3";
    var user3 = new serviceEntities.User(user3Name, user3Location, user3Token);

    var user4Name = 'Testeur4';
    var user4Location = [40.0, 40.0, 40.0];
    var user4Token = "4";
    var user4 = new serviceEntities.User(user4Name, user4Location, user4Token);

    var user5Name = 'Testeur5';
    var user5Location = [50.0, 50.0, 50.0];
    var user5Token = "5";
    var user5 = new serviceEntities.User(user5Name, user5Location, user5Token);

    var userNumber = 5;

    it('should add user 2', function (done) {
        database.createUser(user2, function (err, res) {
            expect(err).toBeNull();
            done();
        });
    });

    it('should add user 3', function (done) {
        database.createUser(user3, function (err, res) {
            expect(err).toBeNull();
            done();
        });
    });

    it('should add user 4', function (done) {
        database.createUser(user4, function (err, res) {
            expect(err).toBeNull();
            done();
        });
    });

    it('should add user 5', function (done) {
        database.createUser(user5, function (err, res) {
            expect(err).toBeNull();
            done();
        });
    });


    it('should retrieve the name of the Users in the database', function (done) {

        database.getUsernameList(function (err, item) {
            expect(err).toBeNull();

            // Do we have 5 usernames?
            expect(item.length).toEqual(userNumber);

            // Do we have each username added            
            expect(item).toContain(user1Name);
            expect(item).toContain(user2Name);
            expect(item).toContain(user3Name);
            expect(item).toContain(user4Name);
            expect(item).toContain(user5Name);

            done();
        });

    });

    it('should return all users with their attributes', function (done) {

        // Deleting the _id properties of users
        delete user1['_id'];
        delete user2['_id'];
        delete user3['_id'];
        delete user4['_id'];
        delete user5['_id'];

        database.getUserList(function (err, userList) {

            expect(err).toBeNull();
            expect(userList).not.toBeNull();

            expect(userList.length).toBe(userNumber);

            expect(userList).toContain(user1);
            expect(userList).toContain(user2);
            expect(userList).toContain(user3);
            expect(userList).toContain(user4);
            expect(userList).toContain(user5);

            done();

        });

    });


    it('should delete the user 1', function (done) {

        database.deleteUser(user1Token, function (err, res) {
            expect(err).toBeNull();

            done();
        });
    });


    it('should check that the user 1 is deleted', function (done) {
        database.getUser(user1Token, function (err, item) {

            expect(err).toBeNull();
            expect(item).toBeNull();

            done();
        });

    });

    it('should delete the user 2', function (done) {
        database.deleteUser(user2Token, function (err, res) {
            expect(err).toBeNull();
            done();
        });
    });

    it('should delete the user 3', function (done) {
        database.deleteUser(user3Token, function (err, res) {
            expect(err).toBeNull();
            done();
        });
    });

    it('should delete the user 4', function (done) {
        database.deleteUser(user4Token, function (err, res) {
            expect(err).toBeNull();
            done();
        });
    });

    it('should delete the user 5', function (done) {
        database.deleteUser(user5Token, function (err, res) {
            expect(err).toBeNull();
            done();
        });
    });



});