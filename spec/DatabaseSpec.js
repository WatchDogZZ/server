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

    it('should create a new user', function (done) {

        var user1 = new serviceEntities.User(user1Name, user1Location);

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


    it('should delete the user', function (done) {

        database.deleteUser(user1Name, (err, res) => {
            expect(err).toBeNull();

            done();
        });
    });


    it('should check that the user is deleted', function(done) {
        database.getUser(user1Name, (err, item) => {
            
            expect(err).toBeNull();
            expect(item).toBeNull();

            done();
        });

    });


});