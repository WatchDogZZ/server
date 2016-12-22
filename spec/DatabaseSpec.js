// Testing the database functions

// Requires
var MongoClient = require('mongodb').MongoClient;
const database = require('../database.js');
const serviceEntities = require('../service.entities');


// Global data for testing
var DATABASE_NAME = 'watchdogzz';
var DATABASE_PORT = 27017;
var DATABASE_URL = 'mongodb://localhost:' + DATABASE_PORT + '/' + DATABASE_NAME;


describe('Mongo database', function () {

    it('should connect to the Database', function () {

        database.connect();

    });

    
    const user1Name = 'Testeur1';
    const user1Location = [10.0, 10.0, 10.0];

    it('should create a new user', function () {

        var user1 = new serviceEntities.User(user1Name, user1Location);

        database.createUser(user1);

    });


    it('should retrieve the created user', function (done) {
        
        // Get the user and test it in the callback        
        database.getUser(user1Name, (item) => {

            // Instance of a user to use the methods after            
            var user = serviceEntities.loadUserFromMongoDocument(item);
            
            expect(user).not.toBeNull();

            expect(user.getName(), user1Name);
            expect(user.getLocation(), user1Location);

            done();
        });
        
    });


    it('should update the user location', function (done) {
        
        var newLo = 11.0;
        var newLa = 22.0;
        var newEl = 33.0;

        var loc = [newLo, newLa, newEl];

        // Get the user and update the location
        database.getUser(user1Name, (item) => {

            expect(item).not.toBeNull();

            var userBefore = serviceEntities.loadUserFromMongoDocument(item);

            expect(userBefore).not.toBeNull();

            userBefore.setLocation(loc);

            database.updateUser(userBefore);
        
            done();
            console.log(1);
        });
        
        console.log(2);
        done();

        // Check if the modifications are ok        
        database.getUser(user1Name, (item) => {
console.log(3);
            expect(item).not.toBeNull();

            var userAfter = serviceEntities.loadUserFromMongoDocument(item);

            expect(userAfter).not.toBeNull();

            console.log(userAfter);

            expect(userAfter.getLocation()).toEqual(loc);

        done();
        });
        
    });


    it('should delete the user', function (done) {

        database.deleteUser(user1Name);

        database.getUser(user1Name, (item) => {

            expect(item).toBeNull();
        });

        done();
    });


});