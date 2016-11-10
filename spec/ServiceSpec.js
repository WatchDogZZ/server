// Testing the REST service

var request = require('request');

const SERVICE_URL = "http://localhost:3000";

describe("Service", function () {
    it('should give the array of connected users', function (done) {

        request(SERVICE_URL+"/who", function (error, response, body) {

            expect(body).toEqual(JSON.stringify(['ben', 'benji']));

            done();
        });
    });

    it('should say that ben is at init position', function (done) {

        request(SERVICE_URL+"/where/ben", function (error, response, body) {
           
            expect(body).toEqual(JSON.stringify([0.0, 0.0, 0.0]));

            done();

        });

    });


});