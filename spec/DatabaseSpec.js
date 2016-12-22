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
        /*
        var newLo = 11.0;
        var newLa = 22.0;
        var newEl = 33.0;

        var loc = [newLo, newLa, newEl];

        database.updateUserLocation(user1Name, loc);

        database.getUser(user1Name, (item) => {
            var user = new serviceEntities.User(item);

            expect(user.getLocation()[0]).toEqual(0);
            expect(1).toEqual(0);
        
            done();
        });
        

        database.getUser(user1Name, (val) => {

            var user2 = serviceEntities.loadUserFromMongoDocument(val);

            user2.getName();

            console.log(user2);

            // user2.setLocation(99, 99, 99);

            // database.updateUser(user2);

        });
        */
            done();
    });

    
    it('should delete the user', function (done) {

        database.deleteUser(user1Name);

        database.getUser(user1Name, (item) => {

            expect(item).toBeNull();
        });

        done();
    });
    
    // // Clear the base    
    // MongoClient.connect(DATABASE_URL, (err, db) => {
    //     db.collection('usersCollection').drop();
    // });

});