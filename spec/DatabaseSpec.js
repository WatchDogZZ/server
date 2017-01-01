// Testing the database functions

// Requires
var MongoClient = require('mongodb').MongoClient;
const database = require('../database.js');
const serviceEntities = require('../service.entities');


// Global data for testing
database.DATABASE_NAME = 'watchdogzztest';
database.DATABASE_PORT = 27017;
database.DATABASE_URL = 'mongodb://localhost:' + database.DATABASE_PORT + '/' + database.DATABASE_NAME;

describe('Mongo database', function () {

    it('should connect to the Database', function () {

        database.connect();

    });

    
    const user1Name = 'Testeur1';
    const user1Location = [10.0, 10.0, 10.0];
    var user1 = new serviceEntities.User(user1Name, user1Location);

    it('should create a new user', function (done) {

        database.createUser(user1, (err, res) => {
            expect(err).toBeNull();
            
            done();
        });
    });


    it('should retrieve the created user', function (done) {
        
        // Get the user and test it in the callback        
        database.getUser(user1Name, (err, item) => {

            expect(err).toBeNull();
            expect(item).not.toBeNull();

            expect(item.getName(), user1Name);
            expect(item.getLocation(), user1Location);

            done();
        });
        
    });


    var newLo = 11.0;
    var newLa = 22.0;
    var newEl = 33.0;

    var loc = [newLo, newLa, newEl];

    it('should update the user location', function (done) {
        

        // Get the user and update the location
        database.getUser(user1Name, (err, item1) => {

            expect(err).toBeNull();
            expect(item1).not.toBeNull();

            item1.setLocation(loc);
            user1.setLocation(loc); // Update the var to match next tests

            database.updateUser(item1, (err, res) => {
                expect(err).toBeNull();

                done();
            });
        
        });
        
    });

    it('should match the location updated value', function (done) {
    
        // Check if the modifications are ok        
        database.getUser(user1Name, (err, item2) => {

            expect(err).toBeNull();
            expect(item2).not.toBeNull();

            expect(item2.getLocation()).toEqual(loc);

        done();
        });
        
    });


    const user2Name = 'Testeur2';
    const user2Location = [20.0, 20.0, 20.0];
    var user2 = new serviceEntities.User(user2Name, user2Location);

    const user3Name = 'Testeur3';
    const user3Location = [30.0, 30.0, 30.0];
    var user3 = new serviceEntities.User(user3Name, user3Location);

    const user4Name = 'Testeur4';
    const user4Location = [40.0, 40.0, 40.0];
    var user4 = new serviceEntities.User(user4Name, user4Location);

    const user5Name = 'Testeur5';
    const user5Location = [50.0, 50.0, 50.0];
    var user5 = new serviceEntities.User(user5Name, user5Location);

    const userNumber = 5;

    it('should add a bunch of users', function (done) {

        database.createUser(user2, (err, res) => { expect(err).toBeNull(); done(); });
        database.createUser(user3, (err, res) => { expect(err).toBeNull(); done(); });
        database.createUser(user4, (err, res) => { expect(err).toBeNull(); done(); });
        database.createUser(user5, (err, res) => { expect(err).toBeNull(); done(); });

    });

    it('should retrieve the name of the Users in the database', function (done) {

        database.getUsernameList((err, item) => {
            expect(err).toBeNull();

            // Do we have 5 usernames            
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

        database.getUserList((err, userList) => {
            
            expect(err).toBeNull();
            expect(userList).not.toBeNull();

            expect(userList.length).toBe(userNumber);

            expect(userList).toContain(user1);
            expect(userList).toContain(user2);
            expect(userList).toContain(user3);
            expect(userList).toContain(user4);
            expect(userList).toContain(user5);
/*
*/
            done();            

        });

    });
    

    it('should delete the user 1', function (done) {

        database.deleteUser(user1Name, (err, res) => {
            expect(err).toBeNull();

            done();
        });
    });


    it('should check that the user 1 is deleted', function(done) {
        database.getUser(user1Name, (err, item) => {

            expect(err).toBeNull();
            expect(item).toBeNull();

            done();
        });

    });

    it('should delete all the users', function (done) {
        
        database.deleteUser(user2Name, (err, res) => { expect(err).toBeNull(); done(); });
        database.deleteUser(user3Name, (err, res) => { expect(err).toBeNull(); done(); });
        database.deleteUser(user4Name, (err, res) => { expect(err).toBeNull(); done(); });
        database.deleteUser(user5Name, (err, res) => { expect(err).toBeNull(); done(); });

    });

});