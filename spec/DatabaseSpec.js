// Testing the database functions

var MongoClient = require('mongodb').MongoClient;

var DATABASE_NAME = 'watchdogzz';
var DATABASE_PORT = 27017;
var DATABASE_URL = 'mongodb://localhost:'+ DATABASE_PORT +'/' + DATABASE_NAME;

describe("Mongo database", function () {

    it('should connect to the Database', function (done) {

        MongoClient.connect(DATABASE_URL, function (err, db) {

            expect(err).toEqual(null);

            done();

        });

    });
    
    
    

});